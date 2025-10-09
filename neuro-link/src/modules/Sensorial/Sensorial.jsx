import React, { useState } from "react";
import LightChase from "./LightChase";
import PulsoMusical from "./PulsoMusical";
import BrisaTactil from "./EcoArmonico";
import "./Sensorial.css";
import { useNavigate } from "react-router-dom";
export default function Sensorial() {
  const [actividadActual, setActividadActual] = useState(null);
  const navigate = useNavigate();

  const volverDashboard = () => {
      navigate("/dashboard");
    };
  const renderActividad = () => {
    switch (actividadActual) {
      case "LightChase":
        return <LightChase volver={() => setActividadActual(null)} />;
      case "PulsoMusical":
        return <PulsoMusical volver={() => setActividadActual(null)} />;
      case "BrisaTactil":
        return <BrisaTactil volver={() => setActividadActual(null)} />;
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

        {/* Brisa Tactil */}
        <button
          className="sensorial-card active"
          onClick={() => setActividadActual("BrisaTactil")}
        >
          <strong>Eco Armónico</strong>
          <p>Refuerza memoria auditiva secuencial.</p>
        </button>
      </div>
      <button
        style={{
          marginTop: "24px",
          padding: "10px 18px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={volverDashboard}
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
}
