import React, { useState, useEffect } from "react";
import "./Sensorial.css";

export default function LucesCalma({ volver }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [running, setRunning] = useState(false);

  const colors = [
    "#A1C4FD", // azul claro
    "#C2E9FB", // celeste
    "#FBC2EB", // rosa pastel
    "#FDEB93", // amarillo suave
    "#B5FFFC", // turquesa
  ];

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }, 3000); // cambio cada 3 segundos
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div
      className="luces-calma"
      style={{
        background: colors[colorIndex],
        transition: "background 3s ease-in-out",
      }}
    >
      <h1 className="actividad-titulo">🌅 Luces que calman</h1>
      <p className="actividad-descripcion">
        Observa los cambios suaves de color y respira profundo.  
        Esta actividad ayuda a relajar la mente y enfocar la atención visual.
      </p>

      {!running ? (
        <button className="boton-actividad" onClick={() => setRunning(true)}>
          Iniciar luces
        </button>
      ) : (
        <button className="boton-actividad detener" onClick={() => setRunning(false)}>
          Detener
        </button>
      )}

      <button className="boton-volver" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}
