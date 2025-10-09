// src/modules/Sensorial/PulsoMusical.js
import React, { useState, useEffect, useRef } from "react";
import "./PulsoMusical.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

export default function PulsoMusical({ volver }) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [fails, setFails] = useState(0);
  const [speed, setSpeed] = useState(0.25);

  const positionRef = useRef(0);
  const directionRef = useRef(1);
  const audioCtxRef = useRef(null);
  const animRef = useRef(null);
  const lastCenterPass = useRef(false);

  // 🧩 Hook para registrar actividad
  const { registrarExito, registrarFallo } = useRegistroActividad();

  const playTone = (freq = 440) => {
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const animate = () => {
    positionRef.current += directionRef.current * speed;

    // Rebote con sonido
    if (positionRef.current >= 100) {
      positionRef.current = 100;
      directionRef.current = -1;
      playTone(500);
    } else if (positionRef.current <= 0) {
      positionRef.current = 0;
      directionRef.current = 1;
      playTone(500);
    }

    // Sonido al pasar por el centro
    if (!lastCenterPass.current && positionRef.current >= 50 && positionRef.current <= 51) {
      playTone(440);
      lastCenterPass.current = true;
    } else if (positionRef.current < 49 || positionRef.current > 51) {
      lastCenterPass.current = false;
    }

    document.querySelector(".indicador")?.style.setProperty("left", `${positionRef.current}%`);
    animRef.current = requestAnimationFrame(animate);
  };

  const start = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    cancelAnimationFrame(animRef.current);
    positionRef.current = 0;
    directionRef.current = 1;
    setScore(0);
    setFails(0);
    setLevel(1);
    setSpeed(0.25);
    setFeedback("🎶 ¡Sigue el ritmo!");
    setPlaying(true);
    animate();
  };

  const stop = (msg = "Detenido") => {
    cancelAnimationFrame(animRef.current);
    setPlaying(false);
    setFeedback(msg);
  };

  const handlePress = async () => {
    if (!playing) return;
    const diff = Math.abs(positionRef.current - 50);
    if (diff <= 10) {
      setScore((s) => s + 1);
      playTone(700);
      setFeedback("✨ ¡Buen ritmo!");

      // ✅ Registrar éxito
      await registrarExito("Sensorial", "Pulso Musical", level);
    } else {
      setFails((f) => f + 1);
      playTone(200);
      setFeedback("❌ Fuera de tiempo");

      // ❌ Registrar fallo
      await registrarFallo("Sensorial", "Pulso Musical", level);
    }
  };

  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setLevel((l) => l + 1);
      setSpeed((s) => Math.min(s + 0.05, 0.6));
      setFeedback(`🎵 Nivel ${level + 1}`);
    }
  }, [score]);

  useEffect(() => {
    if (fails >= 3) {
      stop("😔 Reiniciando...");
      setTimeout(() => start(), 2000);
    }
  }, [fails]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePress();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing]);

  return (
    <div className="pulso-musical">
      <h1 className="actividad-titulo">🎵 Pulso Musical</h1>
      <p className="actividad-descripcion">Presiona cuando la luz esté en la zona verde.</p>

      {!playing ? (
        <button className="boton-actividad" onClick={start}>
          Iniciar
        </button>
      ) : (
        <button className="boton-actividad detener" onClick={() => stop("Detenido manualmente")}>
          Detener
        </button>
      )}

      <div className="barra-contenedor">
        <div className="zona-verde"></div>
        <div className="indicador"></div>
      </div>

      <p className="feedback">{feedback}</p>
      <p className="puntaje">
        ✅ {score} | ❌ {fails} | Nivel {level}
      </p>

      <button className="boton-presionar" onClick={handlePress}>
        Presionar
      </button>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}

