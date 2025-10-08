import React, { useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import "./Sensorial.css";
import LucesCalma from "./LucesCalma";
import ReaccionSensorial from "./ReaccionSensorial";
import PulsoMusical from "./PulsoMusical";

export default function Sensorial() {
  const actividades = getActividadesPorModulo("Sensorial");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  if (actividadSeleccionada) {
    switch (actividadSeleccionada.name) {
      case "Luces que calman":
        return <LucesCalma volver={() => setActividadSeleccionada(null)} />;
      case "Reacción sensorial":
        return <ReaccionSensorial volver={() => setActividadSeleccionada(null)} />;
      case "Pulso musical":
        return <PulsoMusical volver={() => setActividadSeleccionada(null)} />;
      default:
        return null;
    }
  }

  return (
    <div className="sensorial-container">
      <h1 className="sensorial-title">🌈 Módulo Sensorial</h1>
      <p className="sensorial-sub">Selecciona una actividad para comenzar.</p>

      <ul className="activity-list">
        {actividades.map((a, i) => (
          <li
            key={i}
            className="activity-card"
            onClick={() => setActividadSeleccionada(a)}
          >
            <div className="activity-name">{a.name}</div>
            <div className="activity-desc">{a.description}</div>
            <div className="activity-meta">
              <strong>Dificultad:</strong> {a.difficulty} |{" "}
              <strong>Estímulo:</strong> {a.stimulus}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
