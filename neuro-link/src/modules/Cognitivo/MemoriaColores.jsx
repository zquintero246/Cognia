import React, { useEffect, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import clickSound from "../../assets/sound/click.mp3";
import "./MemoriaColores.css";

const BASE_COLORS = [
  { id: "blue", hex: "#A6D8FF" },
  { id: "green", hex: "#A8E6CF" },
  { id: "lav", hex: "#E9D5FF" },
  { id: "peach", hex: "#FFD9B3" },
  { id: "yellow", hex: "#FFF9A6" },
  { id: "pink", hex: "#FFC0CB" },
  { id: "mint", hex: "#B2F2BB" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MemoriaColores({ volver }) {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [pressed, setPressed] = useState(null);
  const [timeStart, setTimeStart] = useState(null);
  const { registrarExito, registrarFallo } = useRegistroActividad();

  // crea el audio una sola vez
  const [click] = useState(() => new Audio(clickSound));

  useEffect(() => {
    generateNewSequence(1); // puedes dejarlo así; "Iniciar" sirve para repetir la secuencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewSequence = async (lvl = level) => {
    const colorPool = BASE_COLORS.slice(0, 3 + Math.floor(lvl / 2)); // más colores con nivel
    const len = Math.min(6, 2 + lvl);
    const seq = Array.from({ length: len }, () =>
      Math.floor(Math.random() * colorPool.length)
    );
    setSequence(seq);
    setUserInput([]);
    setErrorState(false);
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

    try {
      click.currentTime = 0;
      await click.play();
    } catch (_) { /* ignore autoplay */ }

    setPressed(colorIndex);
    setTimeout(() => setPressed(null), 150);

    const nextInput = [...userInput, colorIndex];
    setUserInput(nextInput);

    const expectedIndex = sequence[nextInput.length - 1];
    if (colorIndex !== expectedIndex) {
      setErrorState(true);
      setMessage("❌ Intenta de nuevo");
      await finishRound(false);
      return;
    }

    if (nextInput.length === sequence.length) {
      setMessage("✅ ¡Excelente memoria!");
      await finishRound(true);
    }
  };

  const finishRound = async (success) => {
    if (success) registrarExito("Cognitivo", "Memoria de Colores", level);
    else registrarFallo("Cognitivo", "Memoria de Colores", level);

    if (success) setLevel((l) => Math.min(l + 1, 6));
    else setLevel((l) => Math.max(1, l - 1));

    await sleep(1000);
    setErrorState(false);
    await generateNewSequence(success ? level + 1 : level);
  };

  // === NUEVO: controles ===
  const iniciarSecuencia = async () => {
    if (isShowing) return;
    if (sequence.length) {
      setMessage("Observa la secuencia");
      await showSequence(sequence); // repetir la actual
    } else {
      await generateNewSequence(level); // por si no hubiera
    }
  };

  const reiniciar = async () => {
    if (isShowing) return;
    setLevel(1);
    await generateNewSequence(1);
  };

  const colorPool = BASE_COLORS.slice(0, 3 + Math.floor(level / 2));

  return (
    <div className="memoria-screen">
      <div className="memoria-panel">
        <h2 className="memoria-title">🎨 Memoria de Colores — Nivel {level}</h2>
        <p className="memoria-msg">{message}</p>

        {/* Botones de control */}
        <div className="actions">
          <button className="btn btn-primary" onClick={iniciarSecuencia} disabled={isShowing}>
            ▶ Iniciar secuencia
          </button>
          <button className="btn btn-secondary" onClick={reiniciar} disabled={isShowing}>
            ↺ Reiniciar
          </button>
        </div>

        <div
          className={`color-grid ${errorState ? "error" : ""}`}
          aria-hidden={isShowing}
        >
          {colorPool.map((c, idx) => (
            <button
              key={c.id}
              className={`color-btn ${activeIndex === idx ? "active" : ""} ${
                pressed === idx ? "pressed" : ""
              }`}
              style={{ background: c.hex }}
              onClick={() => handleColorPress(idx)}
              disabled={isShowing}
              aria-label={`Color ${c.id}`}
            />
          ))}
        </div>

        <button className="volver-btn" onClick={volver}>
          ← Volver
        </button>
      </div>
    </div>
  );
}
