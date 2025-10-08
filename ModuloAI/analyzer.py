from typing import Dict, Any, Optional, List
import statistics
from ModuloAI.db import save_session, get_recent_sessions

EMA_ALPHA = 0.3
HISTORY_WINDOW = 10
MIN_RECENT = 3

def _compute_accuracy(correct: int, errors: int, attempts: Optional[int] = None) -> float:
    if attempts is not None and attempts > 0:
        return correct / attempts
    total = correct + errors
    return (correct / total) if total > 0 else 0.0

def _time_penalty(time_seconds: float) -> float:
    baseline = 20.0
    if time_seconds <= baseline:
        return 0.0
    return min(1.0, (time_seconds - baseline) / (baseline * 2))

def _performance_level(score: float) -> str:
    if score >= 0.80:
        return "high"
    if score >= 0.50:
        return "medium"
    return "low"

def _ema(values: List[float], alpha: float = EMA_ALPHA) -> Optional[float]:
    if not values:
        return None
    ema_val = None
    for v in values:
        if ema_val is None:
            ema_val = v
        else:
            ema_val = alpha * v + (1 - alpha) * ema_val
    return ema_val

def decide_difficulty_from_trend(ema_accuracy: float, recent_accuracy: float) -> str:
    if ema_accuracy is None:
        ema_accuracy = recent_accuracy
    if ema_accuracy >= 0.85 and recent_accuracy >= 0.85:
        return "increase"
    if recent_accuracy < 0.45 or ema_accuracy < 0.50:
        return "decrease"
    return "same"

def recommend_next_module(task: str, perf_level: str) -> str:
    mapping = {
        "memoria_colores_01": {
            "low": "attention_basic_v1",
            "medium": "memory_intermediate_v1",
            "high": "memory_advanced_v1"
        }
    }
    return mapping.get(task, {}).get(perf_level, "cognitive_review_v1")

def analyze_performance(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    payload expected keys: user_id, session_id (opt), module, activity_id, correct, errors, time, focus_loss, timestamp (opt)
    """
    user_id = payload.get("user_id", "anon")
    activity_id = payload.get("activity_id", "unknown_activity")
    correct = int(payload.get("correct", 0))
    errors = int(payload.get("errors", 0))
    time_s = float(payload.get("time", 0.0))

    accuracy = _compute_accuracy(correct, errors)
    time_pen = _time_penalty(time_s)
    combined_score = max(0.0, accuracy - time_pen * 0.15)

    save_session(payload)

    raw_hist = get_recent_sessions(user_id, limit=HISTORY_WINDOW)
    hist = list(reversed(raw_hist))
    accuracies = [h["correct"] / (h["correct"] + h["errors"]) if (h["correct"] + h["errors"]) > 0 else 0.0 for h in hist]

    ema_accuracy = _ema(accuracies) if accuracies else None
    recent_slice = accuracies[-MIN_RECENT:] if accuracies else [accuracy]
    recent_accuracy = statistics.mean(recent_slice) if recent_slice else accuracy

    next_diff = decide_difficulty_from_trend(ema_accuracy if ema_accuracy is not None else accuracy, recent_accuracy)
    perf_level = _performance_level(combined_score)
    next_module = recommend_next_module(activity_id, perf_level)

    adjustments = {}
    if activity_id.startswith("memoria_colores"):
        base_seq = 4
        if next_diff == "increase":
            seq_len = min(6, base_seq + 1)
            response_limit = max(8.0, time_s * 0.95)
        elif next_diff == "decrease":
            seq_len = max(2, base_seq - 1)
            response_limit = max(20.0, time_s * 1.1)
        else:
            seq_len = base_seq
            response_limit = max(12.0, time_s)
        adjustments = {
            "sequence_length": int(seq_len),
            "response_time_limit": float(round(response_limit, 2))
        }

    explain = (
        f"acc={round(accuracy,3)}, combined={round(combined_score,3)}, "
        f"ema={round(ema_accuracy,3) if ema_accuracy is not None else 'N/A'}, "
        f"recent={round(recent_accuracy,3)} -> decision={next_diff}"
    )

    return {
        "accuracy": round(accuracy, 3),
        "performance_level": perf_level,
        "recommendation": {
            "next_difficulty": next_diff,
            "next_module": next_module,
            "adjustments": adjustments
        },
        "explainability": explain
    }
