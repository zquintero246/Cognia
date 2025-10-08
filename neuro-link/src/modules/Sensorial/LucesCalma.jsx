import React, { useState, useEffect, useRef } from "react";
import "./Sensorial.css";

export default function LucesCalma({ volver }) {
  const [running, setRunning] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  const dificultad = 2; // 🔹 1 = lento, 2 = medio, 3 = rápido
  const intervalTime = dificultad === 1 ? 4000 : dificultad === 2 ? 2500 : 1500;

  // Movimiento suave del foco
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setPosition({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 70,
        });
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [running, intervalTime]);

  // Verificar si el cursor está dentro del foco
  const handleMouseMove = (e) => {
    if (!containerRef.current || !running) return;

    const rect = containerRef.current.getBoundingClientRect();
    const focoRadius = 60;
    const focoCenter = {
      x: (position.x / 100) * rect.width,
      y: (position.y / 100) * rect.height,
    };

    const cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const distancia = Math.sqrt(
      Math.pow(cursor.x - focoCenter.x, 2) + Math.pow(cursor.y - focoCenter.y, 2)
    );

    // ✅ si el cursor está dentro del radio visible del foco
    if (distancia <= focoRadius) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="luces-calma"
      onMouseMove={handleMouseMove}
    >
      <h1 className="actividad-titulo">🌅 Luces que calman</h1>
      <p className="actividad-descripcion">
        Sigue el foco de luz con el cursor mientras se mueve.
      </p>

      {!running ? (
        <button className="boton-actividad" onClick={() => setRunning(true)}>
          Iniciar
        </button>
      ) : (
        <button className="boton-actividad detener" onClick={() => setRunning(false)}>
          Detener
        </button>
      )}

      <div
        className="foco-luz"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          opacity: running ? 1 : 0,
        }}
      ></div>

      <p className="puntaje">Seguimiento exitoso: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}


