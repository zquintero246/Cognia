from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from ModuloAI.analyzer import analyze_performance
from ModuloAI.db import get_recent_sessions
from ModuloAI.analyze_drawing import predict_from_base64, load_model_if_needed


# --- Inicializar FastAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Cargar modelo al iniciar el servidor ---
@app.on_event("startup")
async def startup_event():
    try:
        load_model_if_needed()
        print("Modelo de dibujo cargado correctamente")
    except Exception as e:
        print("Error cargando el modelo:", e)


# --- Esquema de datos ---
class ActivityPayload(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    module: Optional[str] = "Cognitivo"
    activity_id: Optional[str] = None
    correct: int
    errors: int
    time: float
    focus_loss: Optional[int] = 0
    timestamp: Optional[str] = None


# --- Endpoints ---
@app.get("/")
def home():
    return {"status": "AI server online"}


@app.post("/analyze")
async def analyze(data: ActivityPayload):
    res = analyze_performance(data.dict())
    return res


@app.post("/analyze_drawing")
async def analyze_drawing(request: Request):
    payload = await request.json()
    figura_esperada = (payload.get("figuraEsperada") or "").lower()
    image_b64 = payload.get("image", "")

    try:
        predicted_label, confidence = predict_from_base64(image_b64)
    except Exception as e:
        return {"error": str(e)}

    match = predicted_label.lower() == figura_esperada
    feedback = {
        "predicted": predicted_label,
        "confidence": confidence,
        "match": match,
        "feedback": f"Correcto {predicted_label}" if match else f"Parece un {predicted_label}",
    }
    return feedback


@app.get("/debug/history/{user_id}")
def history(user_id: str):
    rows = get_recent_sessions(user_id, limit=20)
    return {"user_id": user_id, "history": rows}
