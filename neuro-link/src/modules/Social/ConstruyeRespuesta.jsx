import React, { useState } from "react";
import { sendActivity } from "../../services/activityService";
import "./Social.css";

export default function ConstruyeRespuesta({ volver }) {
  // 🔹 Lista ampliada de 10 situaciones
  const situaciones = [
    {
      id: 1,
      contexto: "Tu amigo te regala un dibujo.",
      palabras: ["Gracias", "me", "gusta", "mucho"],
      correcta: ["Gracias", "me", "gusta", "mucho"],
    },
    {
      id: 2,
      contexto: "Llegas tarde a clase.",
      palabras: ["Perdón", "por", "llegar", "tarde"],
      correcta: ["Perdón", "por", "llegar", "tarde"],
    },
    {
      id: 3,
      contexto: "Un compañero te ayuda con una tarea.",
      palabras: ["Gracias", "por", "ayudarme"],
      correcta: ["Gracias", "por", "ayudarme"],
    },
    {
      id: 4,
      contexto: "Alguien te dice: '¿Cómo estás?'",
      palabras: ["Estoy", "bien", "gracias"],
      correcta: ["Estoy", "bien", "gracias"],
    },
    {
      id: 5,
      contexto: "El profesor te felicita por tu trabajo.",
      palabras: ["Gracias", "me", "esforcé", "mucho"],
      correcta: ["Gracias", "me", "esforcé", "mucho"],
    },
    {
      id: 6,
      contexto: "Chocaste sin querer con alguien en el pasillo.",
      palabras: ["Perdón", "no", "fue", "mi", "intención"],
      correcta: ["Perdón", "no", "fue", "mi", "intención"],
    },
    {
      id: 7,
      contexto: "Tu amigo está triste.",
      palabras: ["¿Qué", "te", "pasa?", "quiero", "ayudarte"],
      correcta: ["¿Qué", "te", "pasa?", "quiero", "ayudarte"],
    },
    {
      id: 8,
      contexto: "Un compañero te presta un lápiz.",
      palabras: ["Gracias", "por", "prestarme", "el", "lápiz"],
      correcta: ["Gracias", "por", "prestarme", "el", "lápiz"],
    },
    {
      id: 9,
      contexto: "Alguien entra a la sala.",
      palabras: ["Hola", "¿cómo", "estás?"],
      correcta: ["Hola", "¿cómo", "estás?"],
    },
    {
      id: 10,
      contexto: "Vas a despedirte de tus amigos.",
      palabras: ["Adiós", "nos", "vemos", "mañana"],
      correcta: ["Adiós", "nos", "vemos", "mañana"],
    },
  ];

  // 🔹 Función para desordenar un array (Fisher–Yates shuffle)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // 🔹 Estado inicial con palabras desordenadas
  const [situacionActual, setSituacionActual] = useState(() => {
    const random = situaciones[Math.floor(Math.random() * situaciones.length)];
    return { ...random, palabras: shuffleArray(random.palabras) };
  });

  const [seleccion, setSeleccion] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const onPuntuar = async (puntos = 1) => {
    setScore((s) => s + puntos);
    try {
      await sendActivity({
        modulo: "Social",
        actividad: "Construye la respuesta",
        puntuacion: puntos,
        contexto: situacionActual.contexto,
      });
      console.log("✅ Actividad registrada correctamente (ConstruyeRespuesta)");
    } catch (err) {
      console.warn("⚠️ No se pudo enviar la actividad al servidor:", err);
    }
  };

  const seleccionarPalabra = (palabra) => {
    if (seleccion.includes(palabra)) return;
    setSeleccion([...seleccion, palabra]);
  };

  const validar = () => {
    const correcto =
      JSON.stringify(seleccion) === JSON.stringify(situacionActual.correcta);

    if (correcto) {
      setFeedback("✅ ¡Excelente! Frase correcta.");
      onPuntuar(1);
      setTimeout(() => nuevaSituacion(), 2000);
    } else {
      setFeedback("❌ Intenta de nuevo. Fíjate en el orden.");
    }
  };

  const nuevaSituacion = () => {
    const nueva =
      situaciones[Math.floor(Math.random() * situaciones.length)];
    setSituacionActual({ ...nueva, palabras: shuffleArray(nueva.palabras) });
    setSeleccion([]);
    setFeedback("");
  };

  const reiniciar = () => {
    setSeleccion([]);
    setFeedback("");
  };

  return (
    <div className="actividad-social">
      <h1>🗣️ Construye la respuesta</h1>
      <p className="contexto">
        <strong>Situación:</strong> {situacionActual.contexto}
      </p>

      <div className="palabras-opciones">
        {situacionActual.palabras.map((p, i) => (
          <button
            key={i}
            className={`palabra-boton ${
              seleccion.includes(p) ? "seleccionada" : ""
            }`}
            onClick={() => seleccionarPalabra(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="frase-construida">
        {seleccion.map((p, i) => (
          <span key={i} className="palabra-construida">
            {p}
          </span>
        ))}
      </div>

      <div className="acciones-sociales">
        <button className="boton-actividad" onClick={validar}>
          Validar frase
        </button>
        <button className="boton-actividad limpiar" onClick={reiniciar}>
          Limpiar
        </button>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
      <p className="puntaje">Puntuación: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}

