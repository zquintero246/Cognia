import os
import io
import base64
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

MODEL_FILE = os.path.join(os.path.dirname(__file__), "drawing_classification.keras")

LABELS = {0: "círculo", 1: "cuadrado", 2: "triángulo"}

_model = None


def load_model_if_needed():
    """Carga el modelo en memoria solo una vez."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_FILE):
            raise FileNotFoundError(f"No se encontró el modelo en {MODEL_FILE}")
        _model = load_model(MODEL_FILE)
    return _model


def predict_from_base64(b64_image: str):
    """Recibe una imagen en base64 y devuelve (etiqueta, confianza)."""
    if b64_image.startswith("data:"):
        b64_image = b64_image.split(",", 1)[1]

    # Decodificar la imagen
    img_bytes = base64.b64decode(b64_image)
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    image = image.resize((28, 28))

    # Normalizar
    x = np.array(image).astype("float32") / 255.0
    x = x.reshape(1, 28, 28, 3)

    # Predicción
    model = load_model_if_needed()
    preds = model.predict(x)
    idx = int(np.argmax(preds, axis=1)[0])
    confidence = float(np.max(preds))

    label = LABELS.get(idx, "desconocido")
    return label, confidence
