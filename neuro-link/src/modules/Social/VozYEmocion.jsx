import React, { useState } from "react";
import "./Social.css";

export default function VozYEmocion({ volver }) {
  const emociones = [
    {
      nombre: "Alegría",
      frase: "¡Qué lindo día para jugar juntos!",
      tono: 1.2,
      velocidad: 1.1,
      volumen: 1,
    },
    {
      nombre: "Tristeza",
      frase: "Hoy me siento un poco solo...",
      tono: 0.8,
      velocidad: 0.9,
      volumen: 0.8,
    },
    {
      nombre: "Miedo",
      frase: "Creo que escuché un ruido extraño...",
      tono: 1.4,
      velocidad: 1.2,
      volumen: 0.9,
    },
    {
      nombre: "Enojo",
      frase: "¡Te dije que no toques eso!",
      tono: 0.9,
      velocidad: 1.2,
      volumen: 1,
    },
  ];

  const [emocionActual, setEmocionActual] = useState(
    emociones[Math.floor(Math.random() * emociones.length)]
  );
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [jugado, setJugado] = useState(false);

  const reproducirVoz = () => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(emocionActual.frase);
    utter.pitch = emocionActual.tono;
    utter.rate = emocionActual.velocidad;
    utter.volume = emocionActual.volumen;
    utter.lang = "es-ES";
    synth.speak(utter);
    setJugado(true);
  };

  const verificar = (opcion) => {
    if (!jugado) {
      setFeedback("🔊 Primero escucha la frase.");
      return;
    }

    if (opcion === emocionActual.nombre) {
      setFeedback("✅ ¡Correcto! Reconociste la emoción.");
      setScore((s) => s + 1);
      setTimeout(() => nuevaRonda(), 2000);
    } else {
      setFeedback("❌ No es esa emoción. Escucha el tono nuevamente.");
    }
  };

  const nuevaRonda = () => {
    const nueva = emociones[Math.floor(Math.random() * emociones.length)];
    setEmocionActual(nueva);
    setFeedback("");
    setJugado(false);
  };

  return (
    <div className="actividad-social">
      <h1>🎧 Voz y emoción</h1>
      <p>Escucha la frase y elige qué emoción transmite.</p>

      <button className="boton-actividad" onClick={reproducirVoz}>
        🔊 Escuchar frase
      </button>

      <div className="opciones-emociones">
        {emociones.map((e, i) => (
          <button
            key={i}
            className="opcion-emocion"
            onClick={() => verificar(e.nombre)}
          >
            {e.nombre}
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
