import React, { useEffect, useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";

/* Actividades (las que ya tienes) */
import MemoriaColores from "./MemoriaColores";
import DibujarFigura from "./DibujarFigura";
import SeguirDireccion from "./SeguirDireccion";

/* Estilos + decoraciones */
import "./Cognitivo.css";
import arriba from "./assets/arriba.svg";
import abajo from "./assets/abajo.svg";
import { useNavigate } from "react-router-dom";

export default function Cognitivo() {
  const actividades = getActividadesPorModulo("Cognitivo");

  // Render de actividad seleccionada
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  // Modal de preview
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const volverDashboard = () => navigate("/dashboard");

  // Cerrar modal con Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Toma la primera oración como "característica"
  const getTagline = (text = "") => {
    const first = (text || "").split(".")[0]?.trim();
    return first ? `${first}.` : "";
  };

  const empezarActividad = (actividad) => {
    setPreview(null);
    setActividadSeleccionada(actividad);
  };

  // Render directo de la actividad (no se toca backend/BD)
  if (actividadSeleccionada) {
    switch (actividadSeleccionada.name) {
      case "Memoria de colores":
        return <MemoriaColores volver={() => setActividadSeleccionada(null)} />;
      case "Seguir dirección":
        return <SeguirDireccion volver={() => setActividadSeleccionada(null)} />;
      case "Dibujar la figura":
        return <DibujarFigura volver={() => setActividadSeleccionada(null)} />;
      default:
        return (
          <div className="cognitivo-container">
            <p>
              Actividad no implementada: <strong>{actividadSeleccionada.name}</strong>
            </p>
            <button className="btn btn-back" onClick={() => setActividadSeleccionada(null)}>
              ← Volver
            </button>
          </div>
        );
    }
  }

  return (
    <div className="cognitivo-container">
      {/* SVGs decorativos fijos */}
      <img src={arriba} alt="" aria-hidden="true" className="decor decor-top" />
      <img src={abajo} alt="" aria-hidden="true" className="decor decor-bottom" />

      <div className="cognitivo-content">
        <h1 className="cognitivo-title">Módulo Cognitivo</h1>
        <p className="cognitivo-subtitle">
          Fortalece tu memoria, atención y habilidades de razonamiento a través de ejercicios interactivos.
        </p>

        {/* Tarjetas pastel: Título + característica */}
        <div className="cognitivo-grid">
          {actividades.map((a, i) => (
            <button
              key={a.name || i}
              className={`cognitivo-mini card-${(i % 6) + 1}`}
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

      {/* Modal de preview */}
      {preview && (
        <>
          <div className="modal-backdrop" onClick={() => setPreview(null)} />
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">
                {preview.name}
              </h3>
            </div>

            <div className="modal-body">
              {preview.description && <p className="modal-desc">{preview.description}</p>}
              <div className="modal-meta">
                <span>
                  <b>Dificultad:</b> {preview.difficulty}
                </span>
                <span>
                  <b>Estímulo:</b> {preview.stimulus}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setPreview(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={() => empezarActividad(preview)}>
                Empezar →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
