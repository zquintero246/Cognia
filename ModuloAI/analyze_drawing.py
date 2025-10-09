import os
import io
import base64
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

# === Configuración ===
MODEL_FILE = os.path.join(os.path.dirname(__file__), "drawing_best.keras")
LABELS = {0: "círculo", 1: "cuadrado", 2: "triángulo"}

_model = None


def load_model_if_needed():
    """Carga el modelo una sola vez al iniciar."""
    global _model
    if _model is None:
        print(f"Cargando modelo desde: {MODEL_FILE}")
        if not os.path.exists(MODEL_FILE):
            raise FileNotFoundError(f"No se encontró el modelo en {MODEL_FILE}")
        _model = load_model(MODEL_FILE)
        print("Modelo cargado correctamente.")
    return _model


def analyze_drawing(b64_image: str):
    if b64_image.startswith("data:"):
        b64_image = b64_image.split(",", 1)[1]

    img_bytes = base64.b64decode(b64_image)
    image = Image.open(io.BytesIO(img_bytes)).convert("L")  # <- escala de grises, más consistente
    image.save("debug_input.png")
    image = image.resize((28, 28))

    # 🔹 Normalizar correctamente (sin invertir si no es necesario)
    x = np.array(image).astype("float32") / 255.0
    x = 1.0 - x  # invertir si el fondo es blanco (Canvas)
    x = np.expand_dims(x, axis=(0, -1))  # (1, 28, 28, 1)

    model = load_model_if_needed()
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
        print("No se encontró la imagen para prueba local.")
