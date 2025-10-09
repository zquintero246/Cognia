import React, { useRef, useState, useEffect } from "react";
import "./DibujarFigura.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

export default function DibujarFigura({ volver }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [figuraActual, setFiguraActual] = useState("triángulo");
  const [strokes, setStrokes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState(0);
  const [refuerzo, setRefuerzo] = useState(""); // 🔹 Refuerzo visual

  const { registrarExito, registrarFallo } = useRegistroActividad();
  const figuras = ["triángulo", "cuadrado", "círculo"];

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 400, 400);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    setContext(ctx);
  }, []);


  const cambiarFigura = () => {
    const nueva = figuras[Math.floor(Math.random() * figuras.length)];
    setFiguraActual(nueva);
  };

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
    setStrokes((p) => [...p, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => setDrawing(false);

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setFeedback("");
    setRefuerzo("");
  };

  const validarDibujo = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.fillStyle = "#fff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figuraEsperada: figuraActual,
          image: tempCanvas.toDataURL("image/png"),
        }),
      });

      const data = await res.json();
      const resultText = data.feedback?.toLowerCase() || "";

      if (resultText.includes("correct") || resultText.includes("bien")) {
        registrarExito("Cognitivo", "Dibujar la figura", 3);
        setFeedback("✅ ¡Excelente!");
        setRefuerzo(`🎉 Felicidades, sí era un ${figuraActual}!`);
        setTimeout(() => {
          limpiarCanvas();
          cambiarFigura();
        }, 2000);
      } else {
        registrarFallo("Cognitivo", "Dibujar la figura", 3);
        setFeedback("❌ Intenta de nuevo");
        setRefuerzo(`😅 No era un ${figuraActual}, vuelve a intentarlo`);
        setErrores((e) => e + 1);
      }
    } catch (err) {
      setFeedback("Error al analizar el dibujo");
      registrarFallo("Cognitivo", "Dibujar la figura", 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actividad-cognitiva">
      <h1>Dibuja la figura</h1>
      <p>Instrucción: Dibuja un {figuraActual}</p>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={`canvas-dibujo ${feedback.includes("✅") ? "exito" : feedback.includes("❌") ? "fallo" : ""}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="botones">
        <button onClick={validarDibujo} disabled={loading}>
          {loading ? "Analizando..." : "Validar dibujo"}
        </button>
        <button onClick={limpiarCanvas}>Limpiar</button>
        <button onClick={volver}>⬅ Volver</button>
      </div>

      {refuerzo && <div className="refuerzo">{refuerzo}</div>}
    </div>
  );
}
