import React, { useRef, useState } from "react";
import "./ReflejoSocial.css";

export default function ReflejoSocial({ volver }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [paths, setPaths] = useState({ player1: [], player2: [] });
  const [feedback, setFeedback] = useState("");
  const [roundFinished, setRoundFinished] = useState(false);

  const startDraw = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = currentPlayer === 1 ? "#4C8BF5" : "#FF7B7B";
    ctx.lineWidth = 4;
    ctx.stroke();

    setPaths((prev) => {
      const key = currentPlayer === 1 ? "player1" : "player2";
      return { ...prev, [key]: [...prev[key], { x: offsetX, y: offsetY }] };
    });
  };

  const stopDraw = () => setDrawing(false);

  const limpiarCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const siguienteTurno = () => {
    if (currentPlayer === 1) {
      limpiarCanvas();
      setCurrentPlayer(2);
      setFeedback("Turno del Jugador 2: imita el dibujo del Jugador 1 🎨");
    } else {
      compararDibujos();
    }
  };

  const compararDibujos = () => {
    const p1 = paths.player1;
    const p2 = paths.player2;
    if (p1.length === 0 || p2.length === 0) {
      setFeedback("Ambos deben dibujar antes de comparar.");
      return;
    }

    // Comparación simple: diferencia promedio de posiciones
    const minLen = Math.min(p1.length, p2.length);
    const diffSum = p1.slice(0, minLen).reduce((acc, p, i) => {
      const dx = p.x - p2[i].x;
      const dy = p.y - p2[i].y;
      return acc + Math.sqrt(dx * dx + dy * dy);
    }, 0);
    const diffProm = diffSum / minLen;

    if (diffProm < 40) {
      setFeedback("🎉 ¡Excelente sincronía entre ambos!");
    } else if (diffProm < 80) {
      setFeedback("👍 Muy bien, casi idéntico.");
    } else {
      setFeedback("🙂 Sigan practicando la imitación.");
    }

    setRoundFinished(true);
  };

  return (
    <div className="reflejo-container">
      <h2>🤝 Reflejo Social</h2>
      <p>
        {feedback ||
          (currentPlayer === 1
            ? "Jugador 1: Dibuja una forma libre."
            : "Jugador 2: Imitar el dibujo de Jugador 1.")}
      </p>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="reflejo-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />

      <div className="reflejo-controls">
        <button onClick={siguienteTurno}>
          {currentPlayer === 1 ? "➡️ Pasar turno" : "🧠 Comparar"}
        </button>
        <button onClick={limpiarCanvas}>🧽 Limpiar</button>
        {roundFinished && (
          <button
            onClick={() => {
              limpiarCanvas();
              setPaths({ player1: [], player2: [] });
              setCurrentPlayer(1);
              setRoundFinished(false);
              setFeedback("");
            }}
          >
            🔄 Reiniciar ronda
          </button>
        )}
        <button onClick={volver}>⬅ Volver</button>
      </div>
    </div>
  );
}
