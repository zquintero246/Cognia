import React, { useState } from "react";
import "./Familiar.css";
import ConociendoFamilia from "./ConociendoFamilia";
import ResolviendoConflictos from "./ResolviendoConflictos";
import ApoyoMutuo from "./ApoyoMutuo";
import { useNavigate } from "react-router-dom";

export default function Familiar() {
  const [actividad, setActividad] = useState(null);
  const navigate = useNavigate();
  const volver = () => setActividad(null);
  const volverDashboard = () => {
    navigate("/dashboard");
  };

  if (actividad === "conocer") return <ConociendoFamilia volver={volver} />;
  if (actividad === "conflictos") return <ResolviendoConflictos volver={volver} />;
  if (actividad === "apoyo") return <ApoyoMutuo volver={volver} />;

  return (
    <div className="familiar-container fade-in">
      <h1 className="titulo-familiar">👨‍👩‍👧‍👦 Módulo Familiar</h1>
      <p className="descripcion-familiar">
        Fortalece la comunicación y empatía con tu familia a través de actividades simples y visuales 💕
      </p>

      <div className="actividades-grid">
        <button
          className="actividad-card familiar-btn"
          onClick={() => setActividad("conocer")}
        >
          🧩 <strong>Conociendo a mi familia</strong>
          <p>Descubre cosas nuevas de tus seres queridos mientras juegas.</p>
        </button>

        <button
          className="actividad-card familiar-btn"
          onClick={() => setActividad("conflictos")}
        >
          ☮️ <strong>Resolviendo conflictos</strong>
          <p>Aprende a comunicarte con calma y respeto cuando hay desacuerdos.</p>
        </button>

        <button
          className="actividad-card familiar-btn"
          onClick={() => setActividad("apoyo")}
        >
          💞 <strong>Apoyo mutuo</strong>
          <p>Fortalece la confianza y colaboración con tus familiares.</p>
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
