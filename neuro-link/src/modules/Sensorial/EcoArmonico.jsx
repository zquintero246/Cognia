// src/modules/Sensorial/EcoArmonico.jsx
import React, { useState } from "react";
import "./EcoArmonico.css";

const SOUNDS = [
  { id: "pajaro", label: "🐦", src: "/sounds/pajaro.mp3" },
  { id: "agua", label: "💧", src: "/sounds/agua.mp3" },
  { id: "viento", label: "🌬️", src: "/sounds/viento.mp3" },
  { id: "tambor", label: "🥁", src: "/sounds/tambor.mp3" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function EcoArmonico({ volver }) {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState(null);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState(1);

  const playSound = (sound) => {
    const audio = new Audio(sound.src);
    audio.play();
  };

  const startGame = async () => {
    const newSeq = Array.from(
      { length: Math.min(2 + level, 6) },
      () => Math.floor(Math.random() * SOUNDS.length)
    );
    setSequence(newSeq);
    setUserInput([]);
    setMessage("🎧 Escucha con atención...");
    await playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      const s = SOUNDS[seq[i]];
      setActiveSound(s.id);
      playSound(s);
      await sleep(900);
      setActiveSound(null);
      await sleep(400);
    }
    setIsPlaying(false);
    setMessage("🔊 Repite los sonidos en orden");
  };

  const handleSelect = async (index) => {
    if (isPlaying) return;
    const s = SOUNDS[index];
    playSound(s);

    const next = [...userInput, index];
    setUserInput(next);

    const expected = sequence[next.length - 1];
    if (index !== expected) {
      setMessage("❌ No era ese sonido, intenta de nuevo.");
      await sleep(900);
      setLevel((l) => Math.max(1, l - 1));
      setSequence([]);
      setUserInput([]);
      return;
    }

    if (next.length === sequence.length) {
      setMessage("✅ ¡Excelente oído!");
      setLevel((l) => l + 1);
      await sleep(800);
      startGame();
    }
  };

  return (
    <div className="eco-screen">
      <div className="eco-panel">
        <h2 className="eco-title">🎶 Eco Armónico</h2>
        <p className="eco-subtitle">
          Memoriza y repite la secuencia de sonidos.
        </p>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={startGame}
            disabled={isPlaying}
          >
            🎧 Comenzar
          </button>
          <button className="volver-btn" onClick={volver}>
            ← Volver
          </button>
        </div>

        <p className="eco-msg">{message || "Presiona comenzar para iniciar."}</p>

        <div className="eco-grid">
          {SOUNDS.map((s, i) => (
            <button
              key={s.id}
              className={`eco-btn ${activeSound === s.id ? "active" : ""}`}
              onClick={() => handleSelect(i)}
              disabled={isPlaying}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="eco-level">Nivel actual: {level}</p>
      </div>
    </div>
  );
}
