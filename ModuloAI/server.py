from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from ModuloAI.analyzer import analyze_performance
from ModuloAI.db import get_recent_sessions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
def home():
    return {"status": "AI server online"}

@app.post("/analyze")
async def analyze(data: ActivityPayload):
    res = analyze_performance(data.dict())
    return res

@app.get("/debug/history/{user_id}")
def history(user_id: str):
    rows = get_recent_sessions(user_id, limit=20)
    return {"user_id": user_id, "history": rows}
