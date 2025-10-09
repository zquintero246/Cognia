// src/modules/ExploraPorQue.jsx
import React, { useState } from "react";
import "./ExploraPorQue.css";

const PREGUNTAS = {
  facil: [
    {
      id: 1,
      question: "¿Por qué usamos paraguas cuando llueve?",
      options: [
        "Porque nos protege del agua",
        "Porque es bonito",
        "Porque ayuda a que llueva más",
        "Porque hace ruido",
      ],
      correct: 0,
      explanation:
        "El paraguas sirve para cubrirnos y mantenernos secos cuando llueve.",
    },
    {
      id: 2,
      question: "¿Por qué debemos dormir por la noche?",
      options: [
        "Porque el cuerpo necesita descansar y recuperar energía",
        "Porque la luna nos duerme",
        "Porque el sol se va",
        "Porque así lo dice mamá",
      ],
      correct: 0,
      explanation:
        "Dormir ayuda al cuerpo y al cerebro a descansar y estar listos para el día siguiente.",
    },
    {
      id: 3,
      question: "¿Por qué comemos frutas y verduras?",
      options: [
        "Porque tienen vitaminas que nos mantienen sanos",
        "Porque son de colores bonitos",
        "Porque crecen rápido",
        "Porque son dulces",
      ],
      correct: 0,
      explanation:
        "Las frutas y verduras tienen nutrientes y vitaminas que fortalecen el cuerpo.",
    },
  ],

  normal: [
    {
      id: 1,
      question: "¿Por qué el hielo se derrite al sol?",
      options: [
        "Porque el sol lo calienta y cambia su estado a líquido",
        "Porque el viento lo rompe",
        "Porque el agua quiere salir del hielo",
        "Porque se cansa de estar frío",
      ],
      correct: 0,
      explanation:
        "El calor del sol aumenta la temperatura del hielo, lo que hace que cambie de estado sólido a líquido.",
    },
    {
      id: 2,
      question: "¿Por qué las plantas necesitan luz del sol?",
      options: [
        "Porque el sol les da energía para producir su alimento",
        "Porque el sol las pinta de verde",
        "Porque el sol las calienta",
        "Porque las hace felices",
      ],
      correct: 0,
      explanation:
        "Las plantas usan la luz del sol para hacer fotosíntesis y producir su propio alimento.",
    },
    {
      id: 3,
      question: "¿Por qué debemos lavarnos las manos antes de comer?",
      options: [
        "Porque así quitamos gérmenes y suciedad",
        "Porque el agua es sabrosa",
        "Porque nos gusta el jabón",
        "Porque el agua enfría las manos",
      ],
      correct: 0,
      explanation:
        "Lavarse las manos elimina bacterias y virus que podrían enfermarnos al comer.",
    },
  ],

  dificil: [
    {
      id: 1,
      question: "¿Por qué el cielo se ve azul durante el día?",
      options: [
        "Porque el aire dispersa la luz azul del sol más que otros colores",
        "Porque el mar refleja su color",
        "Porque el sol pinta el cielo",
        "Porque el azul es el color más frío",
      ],
      correct: 0,
      explanation:
        "Las partículas del aire dispersan más la luz azul del sol que otros colores, haciendo que el cielo se vea azul.",
    },
    {
      id: 2,
      question: "¿Por qué los metales se calientan más rápido al sol?",
      options: [
        "Porque absorben mejor el calor",
        "Porque son más pesados",
        "Porque son de color gris",
        "Porque el sol los elige",
      ],
      correct: 0,
      explanation:
        "Los metales conducen y absorben el calor con facilidad, por eso se calientan más rápido.",
    },
    {
      id: 3,
      question: "¿Por qué los barcos flotan aunque son pesados?",
      options: [
        "Porque su forma reparte el peso sobre el agua",
        "Porque el agua los empuja hacia arriba mágicamente",
        "Porque tienen aire dentro",
        "Porque son de color claro",
      ],
      correct: 0,
      explanation:
        "La forma del barco permite que el peso se distribuya sobre el agua, generando flotación.",
    },
  ],
};

export default function ExploraPorQue({ volver, dificultad = "normal", userId = 1 }) {
  const preguntas = PREGUNTAS[dificultad] || PREGUNTAS.normal;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const pregunta = preguntas[current];

  const registrarResultado = async (success) => {
    try {
      await fetch("http://localhost:3001/api/activities/registrar_resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          module: "Explora el Porqué",
          activity: pregunta.question,
          success,
          difficulty: dificultad,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("❌ Error registrando resultado:", err);
    }
  };

  const handleAnswer = async (index) => {
    setSelected(index);
    const correct = index === pregunta.correct;
    const msg = correct
      ? "¡Excelente! Respuesta correcta 🎉"
      : "No es correcto, intenta de nuevo.";
    setFeedback(msg);
    setShowExplanation(correct);

    if (correct) {
      const voice = new SpeechSynthesisUtterance("¡Muy bien! Respuesta correcta.");
      voice.lang = "es-ES";
      window.speechSynthesis.speak(voice);
      await registrarResultado(true);
    } else {
      await registrarResultado(false);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setShowExplanation(false);
    setCurrent((prev) => (prev + 1) % preguntas.length);
  };

  return (
    <div className="explora-container">
      <h2>🔍 Explora el Porqué</h2>
      <p className="explora-instruccion">Lee la pregunta y elige la mejor respuesta.</p>

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

