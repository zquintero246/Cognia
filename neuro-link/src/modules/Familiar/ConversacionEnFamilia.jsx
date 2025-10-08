import React, { useState } from "react";

export default function ConversacionEnFamilia({ onVolver }) {
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("");

  const evaluar = () => {
    if (respuesta.toLowerCase().includes("gracias") || respuesta.toLowerCase().includes("ayuda")) {
      setMensaje("✅ ¡Excelente! Has respondido con empatía y amabilidad.");
    } else {
      setMensaje("💬 Intenta expresar más gratitud o colaboración.");
    }
  };

  return (
    <div>
      <h2 className="actividad-titulo">Conversación en Familia</h2>
      <p>Tu madre te pide ayuda con una tarea doméstica. ¿Qué responderías?</p>
      <input
        type="text"
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        style={{
          padding: "0.6rem",
          borderRadius: "10px",
          width: "80%",
          margin: "1rem 0",
          border: "1px solid #ccc",
        }}
      />
      <div>
        <button className="boton-actividad" onClick={evaluar}>Evaluar</button>
        <button className="boton-volver" onClick={onVolver}>Volver</button>
      </div>
      {mensaje && <p style={{ marginTop: "1rem", fontWeight: "600" }}>{mensaje}</p>}
    </div>
  );
}
