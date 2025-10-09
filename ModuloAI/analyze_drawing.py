import os
import io
import base64
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
import cv2

# === Configuración ===
MODEL_FILE = os.path.join(os.path.dirname(__file__), "drawing_best.keras")
LABELS = {0: "círculo", 1: "cuadrado", 2: "triángulo"}

_model = None


# === Utilidades ===
def load_model_if_needed():
    """Carga el modelo una sola vez."""
    global _model
    if _model is None:
        print(f"Cargando modelo desde: {MODEL_FILE}")
        if not os.path.exists(MODEL_FILE):
            raise FileNotFoundError(f"No se encontró el modelo en {MODEL_FILE}")
        _model = load_model(MODEL_FILE)
        print("Modelo cargado correctamente.")
    return _model


def preprocess_canvas_image(b64_image: str):
    """Preprocesa una imagen proveniente del canvas o archivo local."""
    if b64_image.startswith("data:"):
        b64_image = b64_image.split(",", 1)[1]

    # --- Decodificar base64 ---
    img_bytes = base64.b64decode(b64_image)
    image = Image.open(io.BytesIO(img_bytes)).convert("RGBA")

    # --- Fondo blanco sobre transparencia ---
    bg = Image.new("RGB", image.size, (255, 255, 255))
    bg.paste(image, mask=image.split()[3])  # Usa canal alfa como máscara
    image = bg.convert("L")  # Escala de grises limpia

    arr = np.array(image)

    # --- Detectar figura (zonas oscuras) ---
    mask = cv2.findNonZero(255 - arr)
    if mask is not None:
        x, y, w, h = cv2.boundingRect(mask)

        # --- Agregar padding para no recortar demasiado ---
        padding = int(max(w, h) * 0.2)
        x = max(x - padding, 0)
        y = max(y - padding, 0)
        w = min(w + 2 * padding, arr.shape[1] - x)
        h = min(h + 2 * padding, arr.shape[0] - y)

        arr_cropped = arr[y:y + h, x:x + w]
    else:
        arr_cropped = arr

    # --- Redimensionar a 28x28 (o lo que use tu modelo) ---
    image = Image.fromarray(arr_cropped).resize((28, 28), Image.LANCZOS)

    # --- Normalizar valores 0–1 ---
    arr = np.array(image).astype("float32") / 255.0

    # --- Guardar debug visual ---
    Image.fromarray((arr * 255).astype("uint8")).save("debug_processed.png")

    # --- Expandir dimensiones ---
    arr = np.expand_dims(arr, (0, -1))  # (1, 28, 28, 1)

    # --- Si el modelo espera 3 canales (RGB), duplicar ---
    if load_model_if_needed().input_shape[-1] == 3:
        arr = np.repeat(arr, 3, axis=-1)

    return arr


def analyze_drawing(b64_image: str):
    """Analiza un dibujo y devuelve (etiqueta, confianza)."""
    model = load_model_if_needed()
    x = preprocess_canvas_image(b64_image)
    preds = model.predict(x)
    idx = int(np.argmax(preds, axis=1)[0])
    confidence = float(np.max(preds))
    label = LABELS.get(idx, "desconocido")
    return label, confidence


# === Prueba local ===
if __name__ == "__main__":
    import json

    test_image = r"C:\Users\Zabdiel Julian\Downloads\Cognia-dev\ModuloAI\img_1.png"
    if os.path.exists(test_image):
        with open(test_image, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        result = analyze_drawing(b64)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("⚠ No se encontró la imagen para prueba local.")
