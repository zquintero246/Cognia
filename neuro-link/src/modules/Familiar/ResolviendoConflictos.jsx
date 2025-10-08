import React, { useState } from "react";
import "../../styles/Familiar.css";

export default function ResolviendoConflictos({ setActividadActual }) {
  const pasos = [
    {
      titulo: "1️⃣ Identificar el conflicto",
      texto:
        "Piensen en una situación reciente en la que hubo un desacuerdo. Puede ser algo pequeño, como elegir qué ver en TV o quién lava los platos.",
      pregunta:
        "¿Qué conflicto recuerdan que puedan analizar juntos?",
      placeholder: "Describe brevemente el conflicto...",
    },
    {
      titulo: "2️⃣ Escuchar sin interrumpir",
      texto:
        "Cada miembro comparte su punto de vista mientras los demás escuchan sin interrumpir. La idea es comprender, no responder.",
      pregunta:
        "¿Qué aprendiste al escuchar a los demás sin interrumpir?",
      placeholder: "Escribe tu reflexión...",
    },
    {
      titulo: "3️⃣ Buscar soluciones juntos",
      texto:
        "Ahora trabajen juntos para encontrar una solución que sea justa y respete las emociones de todos.",
      pregunta:
        "¿Qué solución acordaron como familia?",
      placeholder: "Escribe la solución que acordaron...",
    },
  ];

  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  const handleSiguiente = () => {
    if (indice < pasos.length - 1) {
      setIndice(indice + 1);
    } else {
      setFinalizado(true);
    }
  };

  const handleCambio = (e) => {
    setRespuestas({ ...respuestas, [indice]: e.target.value });
  };

  return (
    <div className="familiar-container fade-in">
      {!finalizado ? (
        <>
          <h2 className="familiar-title">{pasos[indice].titulo}</h2>
          <p className="familiar-descripcion">{pasos[indice].texto}</p>

          <p className="familiar-pregunta">{pasos[indice].pregunta}</p>
          <textarea
            className="familiar-textarea"
            placeholder={pasos[indice].placeholder}
            value={respuestas[indice] || ""}
            onChange={handleCambio}
          ></textarea>

          <div className="familiar-botones">
            <button className="familiar-boton" onClick={handleSiguiente}>
              {indice < pasos.length - 1 ? "Siguiente ➜" : "Finalizar"}
            </button>
          </div>
        </>
      ) : (
        <div className="actividad-container fade-in">
          <h2 className="familiar-title">🤝 Reflexión final</h2>
          <p className="familiar-descripcion">
            ¡Excelente trabajo! Resolver conflictos en familia requiere empatía, respeto y comunicación.
            Recuerda que cada desacuerdo es una oportunidad para crecer juntos.
          </p>

          <button
            className="familiar-boton"
            onClick={() => setActividadActual(null)}
          >
            Volver al Módulo Familiar
          </button>
        </div>
      )}
    </div>
  );
}
