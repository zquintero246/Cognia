import React, { useState } from "react";
import "../../styles/Familiar.css";

export default function ApoyoMutuo({ setActividadActual }) {
  const pasos = [
    {
      titulo: "1️⃣ Reconociendo fortalezas",
      texto:
        "Cada miembro de la familia tiene habilidades únicas. Piensen en una cualidad positiva de cada persona (por ejemplo, paciencia, alegría, creatividad, responsabilidad).",
      pregunta:
        "¿Qué fortalezas destacarías de tus familiares?",
      placeholder: "Escribe una o más fortalezas...",
    },
    {
      titulo: "2️⃣ Gestos de apoyo",
      texto:
        "El apoyo mutuo se demuestra con acciones pequeñas pero significativas. Pueden ser palabras de ánimo, ayudar con tareas o simplemente escuchar.",
      pregunta:
        "¿Qué gesto de apoyo podrías tener con cada miembro de tu familia esta semana?",
      placeholder: "Describe tus gestos o compromisos...",
    },
    {
      titulo: "3️⃣ Agradecimiento y conexión",
      texto:
        "Agradecer fortalece los lazos familiares. Expresar gratitud genera bienestar y confianza.",
      pregunta:
        "¿Qué te gustaría agradecer a tu familia hoy?",
      placeholder: "Escribe tu mensaje de agradecimiento...",
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
          <h2 className="familiar-title">💞 Reflexión final</h2>
          <p className="familiar-descripcion">
            ¡Maravilloso! El apoyo mutuo es la base de una familia unida.
            Recuerda valorar las pequeñas acciones y mantener siempre la comunicación y el cariño.
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
