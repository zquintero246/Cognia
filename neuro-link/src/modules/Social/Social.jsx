// src/modules/Social/Social.jsx
import React, { useEffect, useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
<<<<<<< Updated upstream
import TeEntiendo from "./TeEntiendo";
import "./Social.css";
import { useNavigate } from "react-router-dom";
import HistoriasDosCorazones from "./HistoriaDosCorazones";
import ReflejoSocial from "./ReflejoSocial";
=======
import "./Social.css";

// Actividades existentes
import HistoriasDosCorazones from "./HistoriasDosCorazones";
import EmpatiaEnAccion from "./HistoriasDosCorazones"; // (alias si así lo usas)
import VozYEmocion from "./VozYEmocion";
import { useNavigate } from "react-router-dom";

// Decor
import arriba from "./assets/arriba.svg";
import abajo from "./assets/abajo.svg";
>>>>>>> Stashed changes

export default function Social() {
  const actividades = getActividadesPorModulo("Social");

  const [preview, setPreview] = useState(null);             // modal
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null); // render directo

  const navigate = useNavigate();
  const volverDashboard = () => navigate("/dashboard");

  // Cerrar modal con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Toma primera oración como tagline
  const tagline = (txt = "") => {
    const first = (txt || "").split(".")[0]?.trim();
    return first ? `${first}.` : "";
  };

  const empezar = (a) => {
    setPreview(null);
    setActividadSeleccionada(a);
  };

  // Render directo de actividad (sin tocar lógica/BD)
  if (actividadSeleccionada) {
    const volver = () => setActividadSeleccionada(null);
    switch (actividadSeleccionada.name) {
      case "Historias de Dos Corazones":
<<<<<<< Updated upstream
        return <HistoriasDosCorazones {...props} />;
      case "Reflejo Social":
        return <ReflejoSocial {...props} />;
      case "Te entiendo (cooperativo)":
        return <TeEntiendo {...props} />;
=======
        return <HistoriasDosCorazones volver={volver} />;
      case "Empatía en acción":
        return <EmpatiaEnAccion volver={volver} />;
      case "Voz y emoción":
        return <VozYEmocion volver={volver} />;
>>>>>>> Stashed changes
      default:
        return (
          <div className="social-container">
            <p>Actividad no implementada: <strong>{actividadSeleccionada.name}</strong></p>
            <button className="btn btn-back" onClick={volver}>← Volver</button>
          </div>
        );
    }
  }

  return (
    <div className="social-container">
      {/* decoraciones fijas */}
      <img src={arriba} alt="" aria-hidden="true" className="decor decor-top" />
      <img src={abajo} alt="" aria-hidden="true" className="decor decor-bottom" />

      <div className="social-content">
        <h1 className="social-title">🤝 Módulo Social</h1>
        <p className="social-subtitle">
          Practica empatía, comunicación y habilidades sociales con actividades breves y divertidas.
        </p>

        {/* tarjetas minimalistas pastel: título + característica */}
        <div className="social-grid">
          {actividades.map((a, i) => (
            <button
              key={a.name || i}
              className={`social-mini card-${(i % 6) + 1}`}
              onClick={() => setPreview(a)}
            >
              <strong className="mini-title">{a.name}</strong>
              
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={volverDashboard}>
          ← Volver al Dashboard
          </button>
      </div>

      {/* Modal con blur al fondo */}
      {preview && (
        <>
          <div className="modal-backdrop" onClick={() => setPreview(null)} />
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="social-modal-title">
            <div className="modal-header">
              <h3 id="social-modal-title" className="modal-title">{preview.name}</h3>
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
              <button className="btn btn-primary" onClick={() => empezar(preview)}>Empezar →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
