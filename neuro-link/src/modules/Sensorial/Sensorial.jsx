import React, { useState } from "react";
import LightChase from "./LightChase";
import PulsoMusical from "./PulsoMusical";
import EcoArmonico from "./EcoArmonico";
import "./Sensorial.css";
import { useNavigate } from "react-router-dom";

<<<<<<< Updated upstream

=======
import arriba from "./assets/arriba.svg";
import abajo from "./assets/abajo.svg";
>>>>>>> Stashed changes

export default function Sensorial() {
  const [actividadActual, setActividadActual] = useState(null);
  const navigate = useNavigate();

  const volverDashboard = () => navigate("/dashboard");

  const renderActividad = () => {
    switch (actividadActual) {
      case "LightChase":
        return <LightChase volver={() => setActividadActual(null)} />;
      case "PulsoMusical":
        return <PulsoMusical volver={() => setActividadActual(null)} />;
      case "Eco Armónico":
        return <EcoArmonico volver={() => setActividadActual(null)} />;
      default:
        return null;
    }
  };

  if (actividadActual) return renderActividad();

  return (
    <div className="sensorial-container">
      <img src={arriba} alt="" aria-hidden="true" className="decor decor-top" />
      <img src={abajo} alt="" aria-hidden="true" className="decor decor-bottom" />

      <div className="sensorial-content">
        <h1 className="sensorial-title">🎨 <span>Módulo Sensorial</span></h1>
        <p className="sensorial-subtitle">
          Estimula tus sentidos y mejora la coordinación, percepción visual y concentración.
        </p>

        <div className="sensorial-grid">
          <button className="sensorial-card purple" onClick={() => setActividadActual("LightChase")}>
            ✨ <strong>Caza de Luz</strong>
            <p>Ejercicio visual interactivo</p>
          </button>

<<<<<<< Updated upstream
        {/* Brisa Tactil */}
       <button
          className="sensorial-card active"
          onClick={() => setActividadActual("Eco Armónico")}
        >
          <strong>Eco Armónico</strong>
          <p>Refuerza memoria auditiva secuencial.</p>
=======
          <button className="sensorial-card blue" onClick={() => setActividadActual("PulsoMusical")}>
            🎵 <strong>Pulso Musical</strong>
            <p>Ejercicio auditivo-rítmico</p>
          </button>

          <button className="sensorial-card green" onClick={() => setActividadActual("BrisaTactil")}>
            🔊 <strong>Eco Armónico</strong>
            <p>Memoria auditiva secuencial</p>
          </button>
        </div>

        <button className="back-btn" onClick={volverDashboard}>
          ← Volver al Dashboard
>>>>>>> Stashed changes
        </button>

      </div>
    </div>
  );
}
