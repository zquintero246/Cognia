import React, { useState } from "react";
import { getActividadesPorModulo } from "../../services/activityService";
import MemoriaColores from "./MemoriaColores";
import DibujarFigura from "./DibujarFigura";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import FlechasRitmo from "./FlechasRitmo";
import { useNavigate } from "react-router-dom";
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

import "./Cognitivo.css";
import SeguirDireccion from "./SeguirDireccion";

export default function Cognitivo() {
  const navigate = useNavigate();
  const actividades = getActividadesPorModulo("Cognitivo");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const volverDashboard = () => {
    navigate("/dashboard");
  };

  const renderActividad = () => {
    if (!actividadSeleccionada) return null;

    switch (actividadSeleccionada.name) {
      case "Memoria de colores":
        return <MemoriaColores volver={() => setActividadSeleccionada(null)} />;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      case "Flechas Ritmo": // 👈 nombre igual al de activityService
        return <FlechasRitmo volver={() => setActividadSeleccionada(null)} />;
=======
      case "Seguir dirección":
        return <SeguirDireccion volver={() => setActividadSeleccionada(null)} />;
>>>>>>> Stashed changes
=======
      case "Seguir dirección":
        return <SeguirDireccion volver={() => setActividadSeleccionada(null)} />;
>>>>>>> Stashed changes
=======
      case "Seguir dirección":
        return <SeguirDireccion volver={() => setActividadSeleccionada(null)} />;
>>>>>>> Stashed changes
      case "Dibujar la figura":
        return <DibujarFigura volver={() => setActividadSeleccionada(null)} />;
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
      <h1 style={{ color: "#333" }}>🧠 Módulo Cognitivo</h1>

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
          <p style={{ color: "#555" }}>Selecciona una actividad para comenzar.</p>

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

