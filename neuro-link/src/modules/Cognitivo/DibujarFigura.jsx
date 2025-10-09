import React, { useRef, useState, useEffect } from "react";
import "./DibujarFigura.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

export default function DibujarFigura({ volver }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [figuraActual, setFiguraActual] = useState("triángulo");
  const [strokes, setStrokes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState(0);
  const [refuerzo, setRefuerzo] = useState("");

  const { registrarExito, registrarFallo } = useRegistroActividad();
  const figuras = ["triángulo", "cuadrado", "círculo"];

  // ==== Utils ====
  const fillWhite = (c, context) => {
    context.save();
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#fff";
    context.fillRect(0, 0, c.width, c.height);
    context.restore();
  };

  const getCanvasPos = (evt) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (evt.touches && evt.touches[0]) {
      return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top,
      };
    }
    return { x: evt.nativeEvent.offsetX, y: evt.nativeEvent.offsetY };
  };

  // ==== Init ====
  useEffect(() => {
    const c = canvasRef.current;
    const context = c.getContext("2d");
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#000";
    fillWhite(c, context);
    setCtx(context);
  }, []);

  const cambiarFigura = () => {
    const nueva = figuras[Math.floor(Math.random() * figuras.length)];
    setFiguraActual(nueva);
  };

  // ==== Draw mouse ====
  const startDrawing = (e) => {
    if (!ctx) return;
    setDrawing(true);
    const { x, y } = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setStrokes((p) => [...p, { x, y }]);
  };

  const draw = (e) => {
    if (!drawing || !ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokes((p) => [...p, { x, y }]);
  };

  const stopDrawing = () => setDrawing(false);

  // ==== Draw touch ====
  const tStart = (e) => { e.preventDefault(); startDrawing(e); };
  const tMove  = (e) => { e.preventDefault(); draw(e); };
  const tEnd   = (e) => { e.preventDefault(); stopDrawing(); };

  const limpiarCanvas = () => {
    if (!ctx) return;
    const c = canvasRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
    fillWhite(c, ctx); // ← importante
    setStrokes([]);
    setFeedback("");
    setRefuerzo("");
  };

  const validarDibujo = async () => {
    if (!ctx) return;
    if (strokes.length < 8) {
      setFeedback("Dibuja un poco más para analizar ✍️");
      return;
    }
    setLoading(true);

    // Copiamos a un canvas temporal blanco (garantiza fondo)
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tctx = tempCanvas.getContext("2d");
    tctx.fillStyle = "#fff";
    tctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tctx.drawImage(canvas, 0, 0);

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

      // ✅ usar el booleano del backend
      if (data?.match === true) {
        registrarExito("Cognitivo", "Dibujar la figura", 3);
        setFeedback("✅ ¡Excelente!");
        setRefuerzo(`🎉 ¡Sí era un ${figuraActual}!`);
        setTimeout(() => {
          limpiarCanvas();
          cambiarFigura();
        }, 1600);
      } else {
        registrarFallo("Cognitivo", "Dibujar la figura", 3);
        setFeedback("❌ Intenta de nuevo");
        setRefuerzo(`😅 No era un ${figuraActual}, vuelve a intentarlo`);
        setErrores((e) => e + 1);
      }
    } catch (err) {
      console.error(err);
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
        className={`canvas-dibujo ${
          feedback.includes("✅") ? "exito" : feedback.includes("❌") ? "fallo" : ""
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={tStart}
        onTouchMove={tMove}
        onTouchEnd={tEnd}
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
