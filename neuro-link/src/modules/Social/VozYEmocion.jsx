// src/modules/Social/VozYEmocion.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Social.css";

export default function VozYEmocion({ volver, onPuntuar }) {
  const frases = [
    { id: 1, text: "Hola, ¿cómo estás?", expectedKeywords: ["hola", "cómo", "estás"] },
    { id: 2, text: "Gracias por ayudarme", expectedKeywords: ["gracias", "ayudarme"] },
    { id: 3, text: "Me siento feliz hoy", expectedKeywords: ["me", "siento", "feliz"] },
  ];

  const [fraseActual, setFraseActual] = useState(
    frases[Math.floor(Math.random() * frases.length)]
  );
  const [feedback, setFeedback] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Inicializar SpeechRecognition si está disponible
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setFeedback("Error en reconocimiento: " + e.error);
      setListening(false);
    };
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      evaluarTranscripcion(transcript);
    };

    recognitionRef.current = rec;
    // cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
    // eslint-disable-next-line
  }, []);

  const evaluarTranscripcion = (transcript) => {
    const keywords = fraseActual.expectedKeywords;
    // Contar cuántas keywords aparecen
    let aciertos = 0;
    for (const k of keywords) {
      if (transcript.includes(k)) aciertos++;
    }
    const ratio = aciertos / keywords.length;

    if (ratio >= 0.6) {
      setFeedback("✅ ¡Muy bien! Buena pronunciación y entonación.");
      if (onPuntuar) onPuntuar(1);
      setTimeout(() => siguienteFrase(), 1400);
    } else {
      setFeedback("❌ Intenta pronunciar con más claridad. Repite la frase.");
    }
  };

  const iniciarReconocimiento = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      setFeedback("Reconocimiento de voz no disponible en este navegador.");
      return;
    }

    try {
      rec.start();
      setFeedback("Escuchando... habla ahora.");
    } catch (e) {
      // ya iniciado
    }
  };

  const siguienteFrase = () => {
    const nueva = frases[Math.floor(Math.random() * frases.length)];
    setFraseActual(nueva);
    setFeedback("");
  };

  const marcarLeido = () => {
    // fallback: usuario clickea que leyó la frase
    setFeedback("Marcado como leído. Buen trabajo.");
    if (onPuntuar) onPuntuar(1);
    setTimeout(() => siguienteFrase(), 1200);
  };

  return (
    <div className="actividad-social">
      <h1>🔊 Voz y emoción</h1>
      <p className="contexto">
        Lee en voz alta la siguiente frase con entonación adecuada:
      </p>
      <div className="frase-voz">{fraseActual.text}</div>

      <div style={{ marginTop: 18 }}>
        <button className="boton-actividad" onClick={iniciarReconocimiento}>
          {listening ? "Escuchando..." : "Comenzar reconocimiento de voz"}
        </button>

        <button
          className="boton-actividad limpiar"
          style={{ marginLeft: 8 }}
          onClick={marcarLeido}
        >
          Marcar como leído (fallback)
        </button>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}

      <div style={{ marginTop: 14 }}>
        <button className="boton-volver" onClick={volver}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
