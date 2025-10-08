import sqlite3
import json
from datetime import datetime, timezone
from typing import Dict, Any, List

DB_PATH = "moduloai.db"

_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
_cur = _conn.cursor()

_cur.execute("""
CREATE TABLE IF NOT EXISTS session_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    session_id TEXT,
    module TEXT,
    activity_id TEXT,
    timestamp TEXT,
    correct INTEGER,
    errors INTEGER,
    time_seconds REAL,
    focus_loss INTEGER,
    extra_json TEXT
)
""")
_conn.commit()

def save_session(payload: Dict[str, Any]) -> int:
    ts = payload.get("timestamp") or datetime.now(timezone.utc).isoformat()
    extra = json.dumps(payload.get("extra", {}))
    cur = _conn.cursor()
    cur.execute("""
        INSERT INTO session_metrics
        (user_id, session_id, module, activity_id, timestamp, correct, errors, time_seconds, focus_loss, extra_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        payload.get("user_id"),
        payload.get("session_id"),
        payload.get("module"),
        payload.get("activity_id"),
        ts,
        int(payload.get("correct", 0)),
        int(payload.get("errors", 0)),
        float(payload.get("time", 0.0)),
        int(payload.get("focus_loss", 0)),
        extra
    ))
    _conn.commit()
    return cur.lastrowid

def get_recent_sessions(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    cur = _conn.cursor()
    cur.execute("""
        SELECT correct, errors, time_seconds, timestamp
        FROM session_metrics
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT ?
    """, (user_id, limit))
    rows = cur.fetchall()
    out = []
    for r in rows:
        out.append({
            "correct": r[0],
            "errors": r[1],
            "time_seconds": r[2],
            "timestamp": r[3]
        })
    return out
