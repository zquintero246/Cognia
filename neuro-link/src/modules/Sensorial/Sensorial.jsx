import React, { useState } from "react";
import LightChase from "./LightChase";
import PulsoMusical from "./PulsoMusical";
import ReaccionSensorial from "./ReaccionSensorial";
import "./Sensorial.css";

export default function Sensorial() {
  const [actividadActual, setActividadActual] = useState(null);

  const renderActividad = () => {
    switch (actividadActual) {
      case "LightChase":
        return <LightChase volver={() => setActividadActual(null)} />;
      case "PulsoMusical":
        return <PulsoMusical volver={() => setActividadActual(null)} />;
      case "ReaccionSensorial":
        return <ReaccionSensorial volver={() => setActividadActual(null)} />;
      default:
        return null;
    }
  };

  if (actividadActual) return renderActividad();

  return (
    <div className="sensorial-container">
      <h1>🎨 Módulo Sensorial</h1>
      <p>
        Este módulo estimula tus sentidos y ayuda a mejorar la coordinación, la
        percepción visual y la concentración a través de experiencias
        interactivas.
      </p>

      <div className="sensorial-grid">
        {/* Caza de Luz */}
        <button
          className="sensorial-card active"
          onClick={() => setActividadActual("LightChase")}
        >
          ✨ <strong>Caza de Luz</strong>
          <p>Ejercicio visual interactivo</p>
        </button>

        {/* Pulso Musical */}
        <button
          className="sensorial-card active"
          onClick={() => setActividadActual("PulsoMusical")}
        >
          🎵 <strong>Pulso Musical</strong>
          <p>Ejercicio auditivo-ritmico</p>
        </button>

        {/* Reacción Sensorial */}
        <button
          className="sensorial-card active"
          onClick={() => setActividadActual("ReaccionSensorial")}
        >
          🌈 <strong>Reacción Sensorial</strong>
          <p>Ejercicio de reflejos y atención</p>
        </button>
      </div>
    </div>
  );
}
