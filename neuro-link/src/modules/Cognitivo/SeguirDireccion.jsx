import React, { useState, useRef, useEffect } from "react";
import "./Cognitivo.css";

export default function SeguirDireccion({ volver }) {
  const [direccion, setDireccion] = useState("⬆️");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const [inicio, setInicio] = useState(null);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const direcciones = ["⬆️", "⬇️", "⬅️", "➡️"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    limpiarCanvas();
  }, []);

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "100px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(direccion, canvas.width / 2, canvas.height / 2);
  };

  const nuevaDireccion = () => {
    const nueva = direcciones[Math.floor(Math.random() * direcciones.length)];
    setDireccion(nueva);
    setFeedback("");
    limpiarCanvas();
  };

  const comenzarArrastre = (e) => {
    setArrastrando(true);
    setInicio({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const terminarArrastre = (e) => {
    if (!arrastrando || !inicio) return;
    setArrastrando(false);

    const fin = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const dx = fin.x - inicio.x;
    const dy = fin.y - inicio.y;

    let direccionReal = "";
    if (Math.abs(dx) > Math.abs(dy)) {
      direccionReal = dx > 0 ? "➡️" : "⬅️";
    } else {
      direccionReal = dy > 0 ? "⬇️" : "⬆️";
    }

    if (direccionReal === direccion) {
      setFeedback("✅ ¡Excelente! Dirección correcta.");
      setScore((s) => s + 1);
    } else {
      setFeedback("❌ Dirección incorrecta. Intenta de nuevo.");
    }

    setTimeout(nuevaDireccion, 1500);
  };

  useEffect(() => {
    limpiarCanvas();
  }, [direccion]);

  return (
    <div className="actividad-cognitiva">
      <h1>🧭 Seguir dirección</h1>
      <p>Arrastra el cursor en la dirección de la flecha mientras mantienes presionado.</p>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="canvas-direccion"
        onMouseDown={comenzarArrastre}
        onMouseUp={terminarArrastre}
      />

      <p className="feedback">{feedback}</p>
      <p className="puntaje">Puntuación: {score}</p>

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}
