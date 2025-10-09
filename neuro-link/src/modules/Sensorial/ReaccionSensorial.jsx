import React, { useState, useEffect, useRef } from "react";
import "./Sensorial.css";

export default function ReaccionSensorial({ volver }) {
  const [activo, setActivo] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [running, setRunning] = useState(false);
  const [tiempoReaccion, setTiempoReaccion] = useState(null);
  const tiempoInicio = useRef(null);
  const timeoutRef = useRef(null);

  const iniciar = () => {
    setScore(0);
    setFeedback("");
    setTiempoReaccion(null);
    setRunning(true);
    esperarEstimulo();
  };

  const detener = () => {
    setRunning(false);
    setActivo(false);
    clearTimeout(timeoutRef.current);
  };

  const esperarEstimulo = () => {
    const delay = 2000 + Math.random() * 4000; // entre 2 y 6 segundos
    timeoutRef.current = setTimeout(() => {
      setActivo(true);
      tiempoInicio.current = Date.now();
    }, delay);
  };

  const manejarClick = () => {
    if (!running) return;

    if (activo) {
      const reaccion = Date.now() - tiempoInicio.current;
      setTiempoReaccion(reaccion);
      setScore((prev) => prev + 1);
      setFeedback(`¡Excelente reflejo! (${reaccion} ms)`);
      setActivo(false);
      esperarEstimulo();
    } else {
      setFeedback("⏱️ Te apresuraste, espera el estímulo visual.");
    }
  };

  // Permitir barra espaciadora como respuesta
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        manejarClick();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="reaccion-sensorial">
      <h1 className="actividad-titulo">⚡ Reacción Sensorial</h1>
      <p className="actividad-descripcion">
        Presiona el botón (o la barra espaciadora) tan pronto veas el círculo
        cambiar de color.
      </p>

      {!running ? (
        <button className="boton-actividad" onClick={iniciar}>
          Iniciar prueba
        </button>
      ) : (
        <button className="boton-actividad detener" onClick={detener}>
          Detener
        </button>
      )}

      <div
        className={`estimulo ${activo ? "activo" : ""}`}
        onClick={manejarClick}
      ></div>

      {feedback && <p className="feedback">{feedback}</p>}
      {tiempoReaccion && (
        <p className="puntaje">Tiempo de reacción: {tiempoReaccion} ms</p>
      )}
      <p className="puntaje">Puntuación: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}
