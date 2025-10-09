import os, io, base64
import numpy as np
from PIL import Image
import cv2
from tensorflow.keras.models import load_model

MODEL_FILE = os.path.join(os.path.dirname(__file__), "drawing_best.keras")
LABELS = {0: "círculo", 1: "cuadrado", 2: "triángulo"}

_model = None

def load_model_if_needed():
  global _model
  if _model is None:
    if not os.path.exists(MODEL_FILE):
      raise FileNotFoundError(f"No se encontró el modelo en {MODEL_FILE}")
    _model = load_model(MODEL_FILE)
    print("Modelo de dibujo cargado.")
  return _model

def preprocess_canvas_image(b64_image: str):
  # Quitar header data:...
  if b64_image.startswith("data:"):
    b64_image = b64_image.split(",", 1)[1]

  # Decodificar
  img_bytes = base64.b64decode(b64_image)
  image = Image.open(io.BytesIO(img_bytes)).convert("RGBA")

  # Fondo blanco
  bg = Image.new("RGB", image.size, (255, 255, 255))
  bg.paste(image, mask=image.split()[3])  # alfa
  image = bg.convert("L")  # escala de grises

  arr = np.array(image)

  # Encontrar zona dibujada (pixeles oscuros)
  mask = cv2.findNonZero(255 - arr)
  if mask is not None:
    x, y, w, h = cv2.boundingRect(mask)
    padding = int(max(w, h) * 0.2)
    x = max(x - padding, 0)
    y = max(y - padding, 0)
    w = min(w + 2 * padding, arr.shape[1] - x)
    h = min(h + 2 * padding, arr.shape[0] - y)
    arr = arr[y:y+h, x:x+w]

  # Redimensionar a 28x28
  image = Image.fromarray(arr).resize((28, 28), Image.LANCZOS)
  arr = np.array(image).astype("float32") / 255.0

  # Expandir dims -> (1, 28, 28, C)
  arr = np.expand_dims(arr, (0, -1))   # (1,28,28,1)

  # Si el modelo espera 3 canales, replicar
  if load_model_if_needed().input_shape[-1] == 3:
    arr = np.repeat(arr, 3, axis=-1)
  return arr

def analyze_drawing(b64_image: str):
  model = load_model_if_needed()
  x = preprocess_canvas_image(b64_image)
  preds = model.predict(x)
  idx = int(np.argmax(preds, axis=1)[0])
  confidence = float(np.max(preds))
  label = LABELS.get(idx, "desconocido")
  return label, confidence
