import React, { useState } from "react";
import "./ExploraPorQue.css";

const PREGUNTAS = [
  {
    id: 1,
    question: "¿Por qué el hielo se derrite al sol?",
    options: [
      "Porque el sol lo calienta y cambia su estado a líquido",
      "Porque el viento lo rompe",
      "Porque el agua quiere salir del hielo",
      "Porque se cansa de estar frío"
    ],
    correct: 0,
    explanation:
      "El calor del sol aumenta la temperatura del hielo, lo que hace que cambie de estado sólido a líquido."
  },
  {
    id: 2,
    question: "¿Por qué las plantas necesitan luz del sol?",
    options: [
      "Porque las hace felices",
      "Porque el sol les da energía para producir su alimento",
      "Porque el sol calienta la tierra",
      "Porque el sol las pinta de verde"
    ],
    correct: 1,
    explanation:
      "Las plantas usan la luz del sol para hacer fotosíntesis y producir su propio alimento."
  },
  {
    id: 3,
    question: "¿Por qué el cielo se ve azul durante el día?",
    options: [
      "Porque el mar refleja su color",
      "Porque el aire dispersa la luz azul del sol más que otros colores",
      "Porque el sol pinta el cielo",
      "Porque el azul es el color más frío"
    ],
    correct: 1,
    explanation:
      "Las partículas del aire dispersan más la luz azul que otros colores, por eso el cielo se ve azul."
  },
  {
    id: 4,
    question: "¿Por qué debemos lavarnos las manos antes de comer?",
    options: [
      "Porque el agua es sabrosa",
      "Porque así quitamos gérmenes y suciedad",
      "Porque nos gusta el jabón",
      "Porque el agua enfría las manos"
    ],
    correct: 1,
    explanation:
      "Lavarse las manos elimina bacterias y virus que podrían enfermarnos al comer."
  },
  {
    id: 5,
    question: "¿Por qué los pájaros pueden volar?",
    options: [
      "Porque tienen alas y huesos ligeros",
      "Porque el aire los empuja hacia arriba",
      "Porque las nubes los levantan",
      "Porque giran muy rápido"
    ],
    correct: 0,
    explanation:
      "Las alas y los huesos ligeros permiten que los pájaros generen sustentación y puedan volar."
  }
];

export default function ExploraPorQue({ volver }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const pregunta = PREGUNTAS[current];

  const handleAnswer = (index) => {
    setSelected(index);
    const correct = index === pregunta.correct;
    const msg = correct
      ? "¡Excelente! Respuesta correcta 🎉"
      : "No es correcto, intenta de nuevo.";
    setFeedback(msg);
    setShowExplanation(correct);
    if (correct) {
      const voice = new SpeechSynthesisUtterance(
        "¡Muy bien! Respuesta correcta."
      );
      voice.lang = "es-ES";
      window.speechSynthesis.speak(voice);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setShowExplanation(false);
    setCurrent((prev) => (prev + 1) % PREGUNTAS.length);
  };

  return (
    <div className="explora-container">
      <h2>🔍 Explora el Porqué</h2>
      <p className="explora-instruccion">
        Observa la pregunta y elige la respuesta correcta.
      </p>

      <div className="explora-card">
        <h3>{pregunta.question}</h3>

        <div className="explora-options">
          {pregunta.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`explora-btn ${
                selected === i
                  ? i === pregunta.correct
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
              disabled={showExplanation}
            >
              {opt}
            </button>
          ))}
        </div>

        <p className="explora-feedback">{feedback}</p>

        {showExplanation && (
          <div className="explora-explanation">
            <strong>🧠 ¿Sabías que...? </strong>
            <p>{pregunta.explanation}</p>
            <button onClick={nextQuestion}>➡️ Siguiente pregunta</button>
          </div>
        )}
      </div>

      {volver && (
        <button className="volver-btn" onClick={volver}>
          ← Volver
        </button>
      )}
    </div>
  );
}
