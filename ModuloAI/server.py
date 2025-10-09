from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import unicodedata

from ModuloAI.analyze_drawing import analyze_drawing, load_model_if_needed

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
  load_model_if_needed()
  print("Servidor iniciado y modelo precargado.")

def norm(s: str) -> str:
  return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("ascii").lower().strip()

@app.get("/")
def home():
  return {"status": "AI server online"}

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

@app.post("/analyze_drawing")
async def analyze_drawing_endpoint(request: Request):
  payload = await request.json()
  figura_esperada = norm(payload.get("figuraEsperada") or "")
  image_b64 = payload.get("image", "")

  try:
    predicted_label, confidence = analyze_drawing(image_b64)
  except Exception as e:
    print("[ERROR] Falló el análisis del dibujo:", e)
    return {"error": str(e), "match": False}

  match = norm(predicted_label) == figura_esperada
  feedback = {
    "predicted": predicted_label,
    "confidence": confidence,
    "match": match,
    "feedback": ("Correcto, parece un " + predicted_label) if match else ("Incorrecto, parece un " + predicted_label),
  }
  print(f"[DEBUG] esperada={figura_esperada} pred={predicted_label} conf={round(confidence,3)} match={match}")
  return feedback
