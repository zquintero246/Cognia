import React, { useState } from "react";
import "./Social.css";

export default function EmpatiaEnAccion({ volver }) {
  const escenarios = [
    {
      id: 1,
      descripcion: "Tu amigo está llorando porque perdió su juguete favorito.",
      correcta: "Tristeza",
      opciones: ["Felicidad", "Tristeza", "Miedo", "Enojo"],
    },
    {
      id: 2,
      descripcion: "Ganas un juego después de muchos intentos.",
      correcta: "Alegría",
      opciones: ["Alegría", "Tristeza", "Enojo", "Sorpresa"],
    },
    {
      id: 3,
      descripcion: "Un perro grande ladra muy cerca de ti.",
      correcta: "Miedo",
      opciones: ["Felicidad", "Miedo", "Tranquilidad", "Alegría"],
    },
    {
      id: 4,
      descripcion: "Tu hermano rompe accidentalmente tu dibujo.",
      correcta: "Enojo",
      opciones: ["Tristeza", "Sorpresa", "Enojo", "Alegría"],
    },
    {
      id: 5,
      descripcion: "Tu mamá te abraza después de un día largo.",
      correcta: "Amor",
      opciones: ["Amor", "Miedo", "Sorpresa", "Tristeza"],
    },
  ];

  const [escenarioActual, setEscenarioActual] = useState(
    escenarios[Math.floor(Math.random() * escenarios.length)]
  );
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const elegirOpcion = (opcion) => {
    if (opcion === escenarioActual.correcta) {
      setFeedback("✅ ¡Correcto! Reconociste la emoción.");
      setScore((s) => s + 1);
      setTimeout(() => nuevaRonda(), 2000);
    } else {
      setFeedback("❌ No es esa emoción. Piensa cómo se siente la persona.");
    }
  };

  const nuevaRonda = () => {
    const nueva =
      escenarios[Math.floor(Math.random() * escenarios.length)];
    setEscenarioActual(nueva);
    setFeedback("");
  };

  return (
    <div className="actividad-social">
      <h1>💞 Empatía en acción</h1>
      <p className="contexto">
        <strong>Situación:</strong> {escenarioActual.descripcion}
      </p>
      <p>¿Qué emoción representa mejor esta situación?</p>

      <div className="opciones-emociones">
        {escenarioActual.opciones.map((op, i) => (
          <button
            key={i}
            className="opcion-emocion"
            onClick={() => elegirOpcion(op)}
          >
            {op}
          </button>
        ))}
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
      <p className="puntaje">Puntuación: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}
