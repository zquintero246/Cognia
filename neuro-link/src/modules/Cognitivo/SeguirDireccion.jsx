import React, { useEffect, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./SeguirDireccion.css";

const DIRECCIONES = ["Arriba", "Abajo", "Izquierda", "Derecha"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function SeguirDireccion({ volver }) {
  const [actual, setActual] = useState("");
  const [level, setLevel] = useState(1);
  const [mensaje, setMensaje] = useState("Pulsa iniciar para comenzar 🎧");
  const [bloqueado, setBloqueado] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [started, setStarted] = useState(false);
  const { registrarExito, registrarFallo } = useRegistroActividad();

  const reproducirDireccion = async () => {
    setBloqueado(true);
    setMensaje("Escucha la instrucción...");
    setStarted(true);

    const dir = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)];
    setActual(dir);

    const msg = new SpeechSynthesisUtterance(dir);
    msg.lang = "es-ES";
    msg.rate = 0.9;
    speechSynthesis.speak(msg);

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

    await sleep(1500);
    setFeedback(null);
    reproducirDireccion();
  };

  const reiniciar = async () => {
    setLevel(1);
    setFeedback(null);
    setBloqueado(true);
    setStarted(false);
    setMensaje("Pulsa iniciar para comenzar 🎧");
    speechSynthesis.cancel();
  };

  return (
    <div className="direccion-screen">
      <div className="direccion-panel">
        <h2 className="direccion-title">🎧 Seguir Dirección — Nivel {level}</h2>
        <p className="direccion-msg">{mensaje}</p>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={reproducirDireccion}
            disabled={!bloqueado && started}
          >
            ▶ Iniciar instrucción
          </button>
          <button
            className="btn btn-secondary"
            onClick={reiniciar}
            disabled={bloqueado && !started}
          >
            ↺ Reiniciar
          </button>
        </div>

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
          ← Volver
        </button>
      </div>
    </div>
  );
}
