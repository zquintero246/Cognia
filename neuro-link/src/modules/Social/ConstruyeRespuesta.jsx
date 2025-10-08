import React, { useState } from "react";
import { sendActivity } from "../../services/activityService";
import "./Social.css";

export default function ConstruyeRespuesta({ volver }) {
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
  ];

  const [situacionActual, setSituacionActual] = useState(
    situaciones[Math.floor(Math.random() * situaciones.length)]
  );
  const [seleccion, setSeleccion] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  // ✅ Nueva función onPuntuar (antes daba error)
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
      onPuntuar(1); // ahora sí está definida
      setTimeout(() => nuevaSituacion(), 2000);
    } else {
      setFeedback("❌ Intenta de nuevo. Fíjate en el orden.");
    }
  };

  const nuevaSituacion = () => {
    const nueva =
      situaciones[Math.floor(Math.random() * situaciones.length)];
    setSituacionActual(nueva);
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
