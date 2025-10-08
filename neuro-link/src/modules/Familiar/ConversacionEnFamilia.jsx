// src/modules/Familiar/ConociendoFamilia.jsx
import React, { useState } from "react";
import "../../styles/Familiar.css";

export default function ConociendoFamilia() {
  const preguntas = [
    "¿Qué cosas disfruto más cuando estoy con mi familia?",
    "¿Qué situaciones suelen causar malentendidos en casa?",
    "¿Qué me gustaría que mi familia comprendiera mejor sobre mí?",
    "¿Qué creo que mi familia necesita de mí?",
    "¿Qué puedo hacer para mejorar la convivencia en casa?"
  ];

  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  const manejarCambio = (pregunta, valor) => {
    setRespuestas((prev) => ({ ...prev, [pregunta]: valor }));
  };

  const enviarRespuestas = () => {
    // Podrías enviar al backend o guardar localmente
    console.log("Respuestas del usuario:", respuestas);
    setFinalizado(true);
  };

  if (finalizado) {
    return (
      <div className="familiar-container">
        <h2 className="familiar-title">💖 ¡Excelente trabajo!</h2>
        <p className="familiar-descripcion">
          Has reflexionado sobre tu entorno familiar.  
          Recuerda que la empatía y la comunicación sincera son la base de una convivencia saludable.
        </p>
        <button className="familiar-boton" onClick={() => setFinalizado(false)}>
          Volver al ejercicio
        </button>
      </div>
    );
  }

  return (
    <div className="familiar-container">
      <h2 className="familiar-title">🧩 Conociendo a mi familia</h2>
      <p className="familiar-descripcion">
        Reflexiona sobre las siguientes preguntas. No hay respuestas correctas o incorrectas,
        solo tu forma de ver y sentir a tu familia.
      </p>

      <div className="familiar-preguntas">
        {preguntas.map((pregunta, idx) => (
          <div key={idx} className="familiar-pregunta-card">
            <p className="pregunta-texto">{pregunta}</p>
            <textarea
              className="familiar-textarea"
              rows="3"
              placeholder="Escribe tu respuesta aquí..."
              value={respuestas[pregunta] || ""}
              onChange={(e) => manejarCambio(pregunta, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="familiar-boton" onClick={enviarRespuestas}>
        Guardar Reflexión
      </button>
    </div>
  );
}
