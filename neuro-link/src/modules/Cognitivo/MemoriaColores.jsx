import React, { useEffect, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./MemoriaColores.css";

const COLORS = [
  { id: "blue", hex: "#A6D8FF" },
  { id: "green", hex: "#A8E6CF" },
  { id: "lav", hex: "#E9D5FF" },
  { id: "peach", hex: "#FFD9B3" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MemoriaColores({ volver }) {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [timeStart, setTimeStart] = useState(null);

  // 🔗 Hook para registrar datos de actividad
  const { registrarExito, registrarFallo } = useRegistroActividad();

  const generateNewSequence = async (lvl = level) => {
    const len = Math.min(6, 2 + lvl);
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
      setMessage("Casi… intenta otra vez 😅");
      await finishRound(false);
      return;
    }

    if (nextInput.length === sequence.length) {
      setMessage("¡Excelente memoria! 🧠");
      await finishRound(true);
    }
  };

  const finishRound = async (success) => {
    const tiempo = timeStart ? Math.round((Date.now() - timeStart) / 1000) : 0;

    // ✅ Registrar resultado en la base de datos
    if (success) {
      registrarExito("Cognitivo", "Memoria de Colores", level);
    } else {
      registrarFallo("Cognitivo", "Memoria de Colores", level);
    }

    // Ajuste de dificultad (modo local)
    if (success) {
      setLevel((l) => Math.min(l + 1, 5));
      setMessage("🔥 ¡Nivel superado!");
    } else {
      setLevel((l) => Math.max(1, l - 1));
      setMessage("📉 Nivel reducido para practicar");
    }

    await sleep(1000);
    await generateNewSequence(level);
  };

  return (
    <div className="memoria-container">
      <h2>🎨 Memoria de Colores — Nivel {level}</h2>
      <p className="memoria-msg">{message}</p>

      <div className="color-grid" aria-hidden={isShowing}>
        {COLORS.map((c, idx) => (
          <button
            key={c.id}
            className={`color-btn ${activeIndex === idx ? "active" : ""}`}
            style={{ background: c.hex }}
            onClick={() => handleColorPress(idx)}
            disabled={isShowing}
          />
        ))}
      </div>

      <div className="memoria-controls">
        <button
          className="start-btn"
          onClick={() => generateNewSequence(level)}
          disabled={isShowing}
        >
          {isShowing ? "Mostrando..." : "▶️ Iniciar secuencia"}
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            setLevel(1);
            generateNewSequence(1);
          }}
        >
          🔄 Reiniciar
        </button>
        <button className="volver-btn" onClick={volver}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}

