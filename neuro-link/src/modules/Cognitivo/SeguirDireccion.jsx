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

  useEffect(() => {
    reproducirDireccion();
  }, []);

  const reproducirDireccion = async () => {
    setBloqueado(true);
    const dir = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)];
    setActual(dir);
    const msg = new SpeechSynthesisUtterance(dir);
    msg.lang = "es-ES";
    msg.rate = 0.8 + level * 0.05;
    speechSynthesis.speak(msg);
    await sleep(800 + (5 - level) * 200);
    setBloqueado(false);
    setMensaje("Selecciona la dirección correcta");
  };

  const handleRespuesta = async (respuesta) => {
    if (bloqueado) return;
    setBloqueado(true);

    const correcto = respuesta === actual;
    setFeedback({ dir: respuesta, correcto });

    if (correcto) {
      registrarExito("Cognitivo", "Seguir Dirección", level);
      setMensaje("✅ ¡Excelente!");
      setLevel((l) => Math.min(l + 1, 5));
    } else {
      registrarFallo("Cognitivo", "Seguir Dirección", level);
      setMensaje("❌ Intenta de nuevo");
      setLevel((l) => Math.max(1, l - 1));
    }

    await sleep(1000);
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
