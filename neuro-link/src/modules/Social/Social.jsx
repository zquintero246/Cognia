import React, { useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import ConstruyeRespuesta from "./ConstruyeRespuesta"; 
import EmpatiaEnAccion from "./EmpatiaEnAccion"; 
import VozYEmocion from "./VozYEmocion"; 
import "./Social.css";

export default function Social() {
  const actividades = getActividadesPorModulo("Social");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const renderActividad = () => {
    if (!actividadSeleccionada) return null;

    switch (actividadSeleccionada.name) {
      case "Construye la respuesta":
        return <ConstruyeRespuesta volver={() => setActividadSeleccionada(null)} />;
      case "Empatía en acción":
        return <EmpatiaEnAccion volver={() => setActividadSeleccionada(null)} />;
      case "Voz y emoción":
        return <VozYEmocion volver={() => setActividadSeleccionada(null)} />;
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
    <div
      style={{
        padding: "24px",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#333" }}>🤝 Módulo Social</h1>

      {actividadSeleccionada ? (
        <div>
          <h2 style={{ marginTop: "10px" }}>{actividadSeleccionada.name}</h2>
          {renderActividad()}
          <button
            style={{
              marginTop: "16px",
              padding: "10px 18px",
              background: "#eaeaea",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setActividadSeleccionada(null)}
          >
            ← Volver a la lista
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: "#555" }}>
            Selecciona una actividad para comenzar.
          </p>

          {actividades.length === 0 ? (
            <p>No se encontraron actividades para este módulo.</p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginTop: "20px",
                display: "grid",
                gap: "14px",
                justifyContent: "center",
              }}
            >
              {actividades.map((a, index) => (
                <li
                  key={index}
                  onClick={() => setActividadSeleccionada(a)}
                  style={{
                    background: "#f6f8fa",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    width: "320px",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <strong>{a.name}</strong>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}>
                    {a.description}
                  </p>
                  <small style={{ color: "#777" }}>🎯 {a.why_useful}</small>
                  <p style={{ marginTop: "6px", fontSize: "13px" }}>
                    <strong>Dificultad:</strong> {a.difficulty} |{" "}
                    <strong>Estímulo:</strong> {a.stimulus}
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
