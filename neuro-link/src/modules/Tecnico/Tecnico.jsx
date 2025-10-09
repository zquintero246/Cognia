// src/modules/Tecnico/Tecnico.jsx
import React, { useEffect, useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import ConstruyeRobot from "./ConstruyeRobot";
import EncuentraError from "./EncuentraError";
import MiniProgramador from "./MiniProgramador";
import "./Tecnico.css";
import arriba from "./assets/arriba.svg";
import abajo from "./assets/abajo.svg";
import { useNavigate } from "react-router-dom";

export default function Tecnico() {
  const actividades = getActividadesPorModulo("Tecnico");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const volverDashboard = () => navigate("/dashboard");

  // Cierra modal con tecla ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getTagline = (text = "") => {
    const first = (text || "").split(".")[0]?.trim();
    return first ? `${first}.` : "";
  };

  const empezarActividad = (actividad) => {
    setPreview(null);
    setActividadSeleccionada(actividad);
  };

  // Render directo de la actividad seleccionada
  if (actividadSeleccionada) {
    switch (actividadSeleccionada.name) {
<<<<<<< Updated upstream
      case "Mini programador":
        return <MiniProgramador/>;
      case "Construye tu robot":
        return <ConstruyeRobot />;
      case "Encuentra el error":
        return <EncuentraError />;
=======
      case "Paso a paso: la ciencia de la vida diaria":
        return <PasoAPaso volver={() => setActividadSeleccionada(null)} />;
      case "Explora el porqué":
        return <ExploraPorQue volver={() => setActividadSeleccionada(null)} />;
      case "Clasifica por su función":
        return <ClasificaFuncion volver={() => setActividadSeleccionada(null)} />;
>>>>>>> Stashed changes
      default:
        return (
          <div className="tecnico-container">
            <p>
              Actividad no implementada:{" "}
              <strong>{actividadSeleccionada.name}</strong>
            </p>
            <button className="btn btn-back" onClick={() => setActividadSeleccionada(null)}>
              ← Volver
            </button>
          </div>
        );
    }
  }

  return (
    <div className="tecnico-container">
      {/* decoraciones fijas */}
      <img src={arriba} alt="" aria-hidden="true" className="decor decor-top" />
      <img src={abajo} alt="" aria-hidden="true" className="decor decor-bottom" />

      <div className="tecnico-content">
        <h1 className="tecnico-title">Módulo Técnico</h1>
        <p className="tecnico-subtitle">
          Aprende y aplica conocimientos prácticos que estimulan tu pensamiento científico.
        </p>

        <div className="tecnico-grid">
          {actividades.map((a, i) => (
            <button
              key={a.name || i}
              className={`tecnico-mini card-${(i % 6) + 1}`}
              onClick={() => setPreview(a)}
            >
              <strong className="mini-title">{a.name}</strong>
              <span className="mini-tagline">{getTagline(a.description)}</span>
            </button>
          ))}
        </div>

        <button className="back-btn" onClick={volverDashboard}>
          ← Volver al Dashboard
        </button>
      </div>

      {/* Modal flotante */}
      {preview && (
        <>
          <div className="modal-backdrop" onClick={() => setPreview(null)} />
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">{preview.name}</h3>
            </div>

            <div className="modal-body">
              {preview.description && <p className="modal-desc">{preview.description}</p>}
              <div className="modal-meta">
                <span><b>Dificultad:</b> {preview.difficulty}</span>
                <span><b>Estímulo:</b> {preview.stimulus}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setPreview(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => empezarActividad(preview)}>Empezar →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
