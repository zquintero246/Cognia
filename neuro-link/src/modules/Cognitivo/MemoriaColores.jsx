import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { sendActivity } from "../../services/activityService";
import "./MemoriaColores.css";

const COLORS = [
  { id: "blue", hex: "#A6D8FF" },
  { id: "green", hex: "#A8E6CF" },
  { id: "lav", hex: "#E9D5FF" },
  { id: "peach", hex: "#FFD9B3" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MemoriaColores() {
  const { user, setUser } = useUser();
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [timeStart, setTimeStart] = useState(null);

  useEffect(() => {
    // generateNewSequence(level);
  }, []);

  const generateNewSequence = async (lvl = level, seqOverride = null) => {
    const len = seqOverride ?? Math.min(6, 2 + lvl);
    const seq = Array.from({ length: len }, () =>
      Math.floor(Math.random() * COLORS.length)
    );
    setSequence(seq);
    setUserInput([]);
    setMessage("Observa la secuencia");
    await showSequence(seq);
  };

  const showSequence = async (seq) => {
    setIsShowing(true);
    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await sleep(700);
      setActiveIndex(-1);
      await sleep(300);
    }
    setIsShowing(false);
    setTimeStart(Date.now());
    setMessage("Ahora repite la secuencia");
  };

  const handleColorPress = async (colorIndex) => {
    if (isShowing) return;
    const nextInput = [...userInput, colorIndex];
    setUserInput(nextInput);

    const expectedIndex = sequence[nextInput.length - 1];
    if (colorIndex !== expectedIndex) {
      setMessage("Casi… intenta otra vez");
      await finishRound(false, nextInput);
      return;
    }

    if (nextInput.length === sequence.length) {
      setMessage("¡Lo lograste!");
      await finishRound(true, nextInput);
    }
  };

  const finishRound = async (success, finalInput) => {
    const timeSec = timeStart ? Math.round((Date.now() - timeStart) / 1000) : 0;
    const correctCount = finalInput.filter(
      (val, idx) => sequence[idx] === val
    ).length;
    const errors = sequence.length - correctCount;

    const result = {
      user_id: user?.nombre || "anon",
      session_id: `${user?.nombre || "anon"}_${Date.now()}`,
      module: "Cognitivo",
      activity_id: "memoria_colores_01",
      correct: correctCount,
      errors: errors,
      time: timeSec,
      focus_loss: 0,
    };

    setUser((prev) => ({
      ...prev,
      progreso: {
        ...prev.progreso,
        cognitivo: (prev?.progreso?.cognitivo || 0) + (success ? 1 : 0),
      },
    }));

    let aiResponse = null;
    try {
      aiResponse = await sendActivity(result);
      console.log("AI response:", aiResponse);
    } catch (e) {
      console.warn("sendActivity falló:", e);
    }

    let seqOverride = null;

    if (aiResponse?.recommendation) {
      const { next_difficulty, next_module, adjustments } = aiResponse.recommendation;

      if (next_difficulty === "increase") {
        setLevel((l) => l + 1);
        setMessage("🔥 Subiendo dificultad");
      } else if (next_difficulty === "decrease") {
        setLevel(1);
        setMessage("Tomémoslo suave, reiniciando nivel");
      } else {
        setMessage("Nivel estable, sigue así 😎");
      }

      if (adjustments?.sequence_length) seqOverride = adjustments.sequence_length;

      if (next_module && next_module !== result.activity_id) {
        console.log(`IA recomienda cambiar a: ${next_module}`);
      }
    }

    await sleep(800);
    setMessage("Preparando siguiente secuencia…");
    await sleep(600);
    await generateNewSequence(level, seqOverride);
  };

  return (
    <div className="memoria-container">
      <h2>Memoria de Colores — Nivel {level}</h2>
      <p className="memoria-msg">{message}</p>

      <div className="color-grid" aria-hidden={isShowing}>
        {COLORS.map((c, idx) => (
          <button
            key={c.id}
            className={`color-btn ${activeIndex === idx ? "active" : ""}`}
            style={{ background: c.hex }}
            onClick={() => handleColorPress(idx)}
            disabled={isShowing}
            aria-label={`color-${c.id}`}
          />
        ))}
      </div>

      <div className="memoria-controls">
        <button
          className="start-btn"
          onClick={() => generateNewSequence(level)}
          disabled={isShowing}
        >
          {isShowing ? "Mostrando..." : "Iniciar secuencia"}
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            setLevel(1);
            generateNewSequence(1);
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
