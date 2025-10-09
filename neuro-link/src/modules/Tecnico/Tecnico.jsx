// src/modules/Tecnico/Tecnico.jsx
import React, { useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import ConstruyeRobot from "./ConstruyeRobot";
import EncuentraError from "./EncuentraError";
import MiniProgramador from "./MiniProgramador";
import "./Tecnico.css";
import { useNavigate } from "react-router-dom";

export default function Tecnico() {
  // Si usas JSON, asegúrate que las actividades del módulo técnico estén definidas ahí.
  const actividades = getActividadesPorModulo("Tecnico");

  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const navigate = useNavigate();

const volverDashboard = () => {
    navigate("/dashboard");
  };

  const renderActividad = () => {
    if (!actividadSeleccionada) return null;

    switch (actividadSeleccionada.name) {
      case "Mini programador":
        return <MiniProgramador/>;
      case "Construye tu robot":
        return <ConstruyeRobot />;
      case "Encuentra el error":
        return <EncuentraError />;
      default:
        return (
          <p>
            Esta actividad aún no está implementada:{" "}
            <strong>{actividadSeleccionada.name}</strong>
          </p>
        );
    }
  };

  return (
    <div className="tecnico-container">
      <h1 className="tecnico-title">⚙️ Módulo Técnico</h1>

      {actividadSeleccionada ? (
        <div className="actividad-contenedor">
          <h2 className="actividad-titulo">{actividadSeleccionada.name}</h2>
          {renderActividad()}
          <button
            className="volver-boton"
            onClick={() => setActividadSeleccionada(null)}
          >
            ← Volver a la lista
          </button>
        </div>
      ) : (
        <div className="lista-contenedor">
          <p className="tecnico-descripcion">
            Selecciona una actividad para comenzar y explorar el conocimiento
            técnico y científico del mundo.
          </p>

          {actividades.length === 0 ? (
            <p>No se encontraron actividades para este módulo.</p>
          ) : (
            <ul className="lista-actividades">
              {actividades.map((a, index) => (
                <li
                  key={index}
                  className="actividad-item"
                  onClick={() => setActividadSeleccionada(a)}
                >
                  <strong>{a.name}</strong>
                  <p className="actividad-desc">{a.description}</p>
                  <small className="actividad-why">{a.why_useful}</small>
                  <p className="actividad-info">
                    <strong>Dificultad:</strong> {a.difficulty} |{" "}
                    <strong>Tipo:</strong> {a.stimulus}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
