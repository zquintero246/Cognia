import React, { useState } from "react";
import "../../styles/Familiar.css";

export default function ConociendoFamilia({ setActividadActual }) {
  const preguntas = [
    {
      id: 1,
      texto: "¿Qué actividad disfrutan más hacer juntos en familia?",
      opciones: ["Ver películas", "Jugar juegos", "Cocinar", "Salir al parque"],
    },
    {
      id: 2,
      texto: "¿Qué palabra describe mejor a tu familia?",
      opciones: ["Unida", "Alegre", "Tranquila", "Creativa"],
    },
    {
      id: 3,
      texto: "¿Qué valor consideran más importante en casa?",
      opciones: ["Respeto", "Empatía", "Comunicación", "Paciencia"],
    },
  ];

  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  const handleRespuesta = (opcion) => {
    setRespuestas({ ...respuestas, [indice]: opcion });

    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      setFinalizado(true);
    }
  };

  return (
    <div className="familiar-container fade-in">
      {!finalizado ? (
        <>
          <h2 className="familiar-title">👨‍👩‍👧 Conociendo a mi familia</h2>
          <p className="familiar-descripcion">{preguntas[indice].texto}</p>

          <div className="familiar-botones">
            {preguntas[indice].opciones.map((op, i) => (
              <button
                key={i}
                className="familiar-boton"
                onClick={() => handleRespuesta(op)}
              >
                {op}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="actividad-container fade-in">
          <h2 className="familiar-title">💬 Reflexión familiar</h2>
          <p className="familiar-descripcion">
            ¡Excelente! Has completado la actividad. Ahora, comparte tus respuestas con tu familia y
            hablen sobre lo que los hace únicos.
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
