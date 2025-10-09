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
<<<<<<< Updated upstream
=======
  const [level, setLevel] = useState(1);
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    if (!ctx) return;
    const c = canvasRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
    fillWhite(c, ctx); // ← importante
=======
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      // ✅ usar el booleano del backend
      if (data?.match === true) {
        registrarExito("Cognitivo", "Dibujar la figura", 3);
=======
      if (resultText.includes("correct") || resultText.includes("bien")) {
        registrarExito("Cognitivo", "Dibujar la figura", level);
>>>>>>> Stashed changes
        setFeedback("✅ ¡Excelente!");
        setRefuerzo(`🎉 ¡Sí era un ${figuraActual}!`);
        setTimeout(() => {
          limpiarCanvas();
          cambiarFigura();
<<<<<<< Updated upstream
        }, 1600);
=======
          setLevel((l) => Math.min(l + 1, 5));
        }, 2000);
>>>>>>> Stashed changes
      } else {
        registrarFallo("Cognitivo", "Dibujar la figura", level);
        setFeedback("❌ Intenta de nuevo");
        setRefuerzo(`😅 No era un ${figuraActual}, vuelve a intentarlo`);
        setErrores((e) => e + 1);
        setLevel((l) => Math.max(1, l - 1));
      }
    } catch (err) {
<<<<<<< Updated upstream
      console.error(err);
      setFeedback("Error al analizar el dibujo");
      registrarFallo("Cognitivo", "Dibujar la figura", 3);
=======
      setFeedback("⚠️ Error al analizar el dibujo");
      registrarFallo("Cognitivo", "Dibujar la figura", level);
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    limpiarCanvas();
    setLevel(1);
    setFeedback("");
    setRefuerzo("");
    cambiarFigura();
  };

  return (
    <div className="dibujo-screen">
      <div className="dibujo-panel">
        <h2 className="dibujo-title">✏️ Dibujar la Figura — Nivel {level}</h2>
        <p className="dibujo-subtitle">Instrucción: Dibuja un {figuraActual}</p>

<<<<<<< Updated upstream
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
=======
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className={`canvas-dibujo ${
            feedback.includes("✅")
              ? "exito"
              : feedback.includes("❌")
              ? "fallo"
              : ""
          }`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
>>>>>>> Stashed changes

        <div className="actions">
          <button className="btn btn-primary" onClick={validarDibujo} disabled={loading}>
            {loading ? "Analizando..." : "Validar dibujo"}
          </button>
          <button className="btn btn-secondary" onClick={limpiarCanvas}>
            Limpiar
          </button>
          <button className="btn btn-secondary" onClick={reiniciar}>
            ↺ Reiniciar
          </button>
          <button className="volver-btn" onClick={volver}>
            ← Volver
          </button>
        </div>

        {refuerzo && <div className="refuerzo">{refuerzo}</div>}
      </div>
    </div>
  );
}
