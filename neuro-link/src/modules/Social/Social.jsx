// src/modules/Social/Social.jsx
import React, { useState, useEffect } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import ConstruyeRespuesta from "./ConstruyeRespuesta";
import EmpatiaEnAccion from "./EmpatiaEnAccion";
import TeEntiendo from "./TeEntiendo";
import "./Social.css";
import { useNavigate } from "react-router-dom";

export default function Social() {
  const actividades = getActividadesPorModulo("Social");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [scoreGlobal, setScoreGlobal] = useState(() => {
    const s = localStorage.getItem("social_score");
    return s ? Number(s) : 0;
  });

  const navigate = useNavigate();

const volverDashboard = () => {
    navigate("/dashboard");
  };


  useEffect(() => {
    localStorage.setItem("social_score", scoreGlobal);
  }, [scoreGlobal]);

  const incrementarPuntaje = (pts = 1) => setScoreGlobal((s) => s + pts);

  const renderActividad = () => {
    if (!actividadSeleccionada) return null;

    const props = {
      volver: () => setActividadSeleccionada(null),
      onPuntuar: (pts = 1) => incrementarPuntaje(pts),
    };

    switch (actividadSeleccionada.name) {
      case "Construye la respuesta":
        return <ConstruyeRespuesta {...props} />;
      case "Empatía en acción":
        return <EmpatiaEnAccion {...props} />;
      case "Te entiendo (cooperativo)":
        return <TeEntiendo {...props} />;
      default:
        return (
          <p className="actividad-noimpl">
            Esta actividad aún no está implementada:{" "}
            <strong>{actividadSeleccionada.name}</strong>
          </p>
        );
    }
  };

  return (
    <div className="social-module fade-in">
      <header className="social-header">
        <h1>🤝 Módulo Social</h1>
        <div className="social-score">⭐ Puntaje: {scoreGlobal}</div>
      </header>

      {actividadSeleccionada ? (
        <div className="actividad-container">
          <h2 className="actividad-titulo">{actividadSeleccionada.name}</h2>
          {renderActividad()}
          <button
            className="boton-volver gradiente"
            onClick={() => setActividadSeleccionada(null)}
          >
            ← Volver a la lista
          </button>
        </div>
      ) : (
        <div className="lista-actividades">
          <p className="lista-subtitulo">
            Escoge una de las siguientes actividades para fortalecer tus habilidades sociales 🌱
          </p>

          {actividades.length === 0 ? (
            <p>No se encontraron actividades disponibles.</p>
          ) : (
            <ul className="lista-grid">
              {actividades.map((a, index) => (
                <li
                  key={index}
                  className="actividad-item card-hover"
                  onClick={() => setActividadSeleccionada(a)}
                >
                  <h3>{a.name}</h3>
                  <p className="actividad-desc">{a.description}</p>
                  <div className="actividad-meta">
                    <span>🎯 {a.why_useful}</span>
                  </div>
                  <small className="actividad-extra">
                    Dificultad: <strong>{a.difficulty}</strong> · Estímulo:{" "}
                    <strong>{a.stimulus}</strong>
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
