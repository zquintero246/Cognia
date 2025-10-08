import React, { useRef, useState, useEffect } from "react";
import "./Cognitivo.css";

export default function DibujarFigura({ volver }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [figuraActual, setFiguraActual] = useState("triángulo");
  const [strokes, setStrokes] = useState([]);

  const figuras = ["triángulo", "cuadrado", "círculo"];

  // Inicializa el contexto de canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#333";
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();

    setStrokes((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setFeedback("");
  };

  const validarDibujo = () => {
    if (strokes.length < 30) {
      setFeedback("Intenta dibujar la figura completa 👀");
      return;
    }

    // 💡 Validación simplificada según figura actual
    if (figuraActual === "círculo") {
      setFeedback("¡Bien! parece un círculo 🟢");
    } else if (figuraActual === "cuadrado") {
      setFeedback("¡Excelente! se parece a un cuadrado 🟦");
    } else if (figuraActual === "triángulo") {
      setFeedback("¡Muy bien! parece un triángulo 🔺");
    }

    // cambia a otra figura aleatoria
    setTimeout(() => {
      limpiarCanvas();
      const nueva = figuras[Math.floor(Math.random() * figuras.length)];
      setFiguraActual(nueva);
    }, 2000);
  };

  return (
    <div className="actividad-cognitiva">
      <h1>Dibuja la figura</h1>
      <p>📝 Instrucción: Dibuja un {figuraActual}</p>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="canvas-dibujo"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="botones">
        <button className="boton-actividad" onClick={validarDibujo}>
          Validar dibujo
        </button>
        <button className="boton-actividad limpiar" onClick={limpiarCanvas}>
          Limpiar
        </button>
        <button className="boton-volver" onClick={volver}>
          ⬅ Volver
        </button>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
