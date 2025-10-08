import React, { useState, useEffect, useRef } from "react";
import "./Sensorial.css";

export default function PulsoMusical({ volver }) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [highlight, setHighlight] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const nextBeatRef = useRef(0);

  // Configuración base
  const BPM = 40; // ritmo base
  const interval = 60 / BPM; // segundos entre beats

  const playTone = () => {
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const start = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    setPlaying(true);
    setScore(0);
    setFeedback("");
    nextBeatRef.current = audioCtxRef.current.currentTime + 2; // espera 2s antes de iniciar

    intervalRef.current = setInterval(() => {
      // Marca visual + audio
      nextBeatRef.current = audioCtxRef.current.currentTime + interval;
      playTone();
      flash();
    }, interval * 1000);
  };

  const stop = () => {
    setPlaying(false);
    clearInterval(intervalRef.current);
  };

  const flash = () => {
    setHighlight(true);
    setTimeout(() => setHighlight(false), 250);
  };

  const handlePress = () => {
    if (!playing) return;
    const now = audioCtxRef.current.currentTime;
    const diff = now - nextBeatRef.current;

    // 🔹 margen extendido: -0.4s antes y +0.6s después
    if (diff > -0.4 && diff < 0.6) {
      setScore((s) => s + 1);
      setFeedback("¡Buen ritmo! 🥁");
    } else if (diff <= -0.4) {
      setFeedback("⏱️ Te adelantaste");
    } else {
      setFeedback("Tarde ⌛");
    }
  };

  // Permitir usar barra espaciadora
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePress();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="pulso-musical">
      <h1 className="actividad-titulo">🎵 Pulso Musical</h1>
      <p className="actividad-descripcion">
        Presiona al ritmo del sonido o la luz (usa la barra espaciadora o el botón).
      </p>

      {!playing ? (
        <button className="boton-actividad" onClick={start}>
          Iniciar ritmo
        </button>
      ) : (
        <button className="boton-actividad detener" onClick={stop}>
          Detener
        </button>
      )}

      <div className={`ritmo-circulo ${highlight ? "activo" : ""}`}></div>

      {feedback && <p className="feedback">{feedback}</p>}
      <p className="puntaje">Puntuación: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}


