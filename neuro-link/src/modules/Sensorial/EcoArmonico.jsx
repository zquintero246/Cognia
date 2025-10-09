import React, { useState, useEffect } from "react";
import "./EcoArmonico.css";

// Lista de sonidos naturales (puedes reemplazar las URLs por archivos locales si los tienes)
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

  // reproducir sonido
  const playSound = (sound) => {
    const audio = new Audio(sound.src);
    audio.play();
  };

  // Generar secuencia
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
      await sleep(1000);
      setActiveSound(null);
      await sleep(500);
    }
    setIsPlaying(false);
    setMessage("🔊 Repite los sonidos en orden");
  };

  const handleSelect = async (index) => {
    if (isPlaying) return;
    const s = SOUNDS[index];
    playSound(s);
    const newInput = [...userInput, index];
    setUserInput(newInput);

    // Verificar el progreso
    const expected = sequence[newInput.length - 1];
    if (index !== expected) {
      setMessage("❌ No era ese sonido, intenta de nuevo.");
      await sleep(1000);
      setLevel((l) => Math.max(1, l - 1));
      setSequence([]);
      setUserInput([]);
      return;
    }

    if (newInput.length === sequence.length) {
      setMessage("✅ ¡Excelente oído!");
      setLevel((l) => l + 1);
      await sleep(1000);
      startGame();
    }
  };

  return (
    <div className="eco-container">
      <h2>🎶 Eco Armónico</h2>
      <p className="eco-msg">{message || "Presiona comenzar para iniciar."}</p>

      <div className="eco-grid">
        {SOUNDS.map((s, i) => (
          <button
            key={s.id}
            className={`eco-btn ${activeSound === s.id ? "activo" : ""}`}
            onClick={() => handleSelect(i)}
            disabled={isPlaying}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="eco-controls">
        <button
          onClick={startGame}
          disabled={isPlaying}
          className="eco-start-btn"
        >
          🎧 Comenzar
        </button>
        {volver && (
          <button className="eco-volver-btn" onClick={volver}>
            ⬅ Volver
          </button>
        )}
      </div>

      <p className="eco-nivel">Nivel actual: {level}</p>
    </div>
  );
}

