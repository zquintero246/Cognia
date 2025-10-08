import React, { useState, useEffect, useRef } from "react";
import "../../styles/FlechasRitmo.css";

export default function FlechasRitmo({ volver }) {
  const [flechas, setFlechas] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [jugando, setJugando] = useState(false);
  const direcciones = ["up", "down", "left", "right"];

  useEffect(() => {
    let interval;
    if (jugando) {
      interval = setInterval(() => {
        const nueva = {
          id: Date.now(),
          dir: direcciones[Math.floor(Math.random() * 4)],
          top: 0,
        };
        setFlechas((prev) => [...prev, nueva]);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jugando]);

  useEffect(() => {
    if (jugando) {
      const animar = setInterval(() => {
        setFlechas((prev) =>
          prev
            .map((f) => ({ ...f, top: f.top + 5 }))
            .filter((f) => f.top < 400)
        );
      }, 100);
      return () => clearInterval(animar);
    }
  }, [jugando]);

  const validar = (dir) => {
    const acierto = flechas.find((f) => f.dir === dir && f.top > 320 && f.top < 400);
    if (acierto) {
      setPuntuacion((p) => p + 10);
      setFlechas((prev) => prev.filter((f) => f.id !== acierto.id));
    }
  };

  return (
    <div className="juego-container">
      <h2 className="titulo-juego">🎵 Flechas del Ritmo</h2>
      <p className="descripcion-juego">
        ¡Presiona la flecha correcta cuando llegue al recuadro! Entrena tu memoria y reflejos.
      </p>

      <div className="zona-juego">
        {flechas.map((f) => (
          <div key={f.id} className={`flecha ${f.dir}`} style={{ top: f.top + "px" }}>
            {f.dir === "up" && "⬆️"}
            {f.dir === "down" && "⬇️"}
            {f.dir === "left" && "⬅️"}
            {f.dir === "right" && "➡️"}
          </div>
        ))}
        <div className="zona-meta"></div>
      </div>

      <div className="zona-controles">
        {direcciones.map((d) => (
          <button key={d} className="boton-control" onClick={() => validar(d)}>
            {d === "up" && "⬆️"}
            {d === "down" && "⬇️"}
            {d === "left" && "⬅️"}
            {d === "right" && "➡️"}
          </button>
        ))}
      </div>

      <h3 className="puntuacion">Puntuación: {puntuacion}</h3>

      {!jugando ? (
        <button className="btn-iniciar" onClick={() => setJugando(true)}>
          ▶️ Iniciar Juego
        </button>
      ) : (
        <button className="btn-detener" onClick={() => setJugando(false)}>
          ⏸️ Pausar
        </button>
      )}

      <button className="btn-volver" onClick={volver}>
        🔙 Volver al módulo
      </button>
    </div>
  );
}
