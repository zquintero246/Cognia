// src/modules/Cognitivo/SeguirDireccion.js
import React, { useEffect, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./SeguirDireccion.css";

const DIRECCIONES = ["Arriba", "Abajo", "Izquierda", "Derecha"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function SeguirDireccion({ volver }) {
  const [actual, setActual] = useState("");
  const [level, setLevel] = useState(1);
  const [mensaje, setMensaje] = useState("Escucha la instrucción...");
  const [bloqueado, setBloqueado] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const { registrarExito, registrarFallo } = useRegistroActividad();

  // Inicia la primera instrucción al montar
  useEffect(() => {
    reproducirDireccion();
  }, []);

  const reproducirDireccion = async () => {
    setBloqueado(true);
    setMensaje("Escucha la instrucción...");
    
    // Seleccionar dirección aleatoria
    const dir = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)];
    setActual(dir);

    // Reproducir con voz
    const msg = new SpeechSynthesisUtterance(dir);
    msg.lang = "es-ES";
    msg.rate = 0.9; // velocidad de voz
    speechSynthesis.speak(msg);

    // Esperar un poco y habilitar botones
    await sleep(1500);
    setBloqueado(false);
    setMensaje("Selecciona la dirección correcta 👇");
  };

  const handleRespuesta = async (respuesta) => {
    if (bloqueado) return;
    setBloqueado(true);

    const correcto = respuesta === actual;
    setFeedback({ dir: respuesta, correcto });

    if (correcto) {
      await registrarExito("Cognitivo", "Seguir Dirección", level);
      setMensaje("✅ ¡Excelente!");
      setLevel((l) => Math.min(l + 1, 5));
    } else {
      await registrarFallo("Cognitivo", "Seguir Dirección", level);
      setMensaje(`❌ No era ${respuesta}. Era ${actual}.`);
      setLevel((l) => Math.max(1, l - 1));
    }

    // Esperar un momento antes de la siguiente ronda
    await sleep(1500);
    setFeedback(null);
    reproducirDireccion();
  };

  return (
    <div className="direccion-container">
      <h2>🎧 Seguir Dirección — Nivel {level}</h2>
      <p className="direccion-msg">{mensaje}</p>

      <div className="botones-direccion">
        {DIRECCIONES.map((dir) => (
          <button
            key={dir}
            onClick={() => handleRespuesta(dir)}
            disabled={bloqueado}
            className={`direccion-btn ${
              feedback?.dir === dir
                ? feedback.correcto
                  ? "correcto"
                  : "incorrecto"
                : ""
            }`}
          >
            {dir}
          </button>
        ))}
      </div>

      <button className="volver-btn" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}

