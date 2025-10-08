// src/modules/Sensorial/CazaDeLuz.jsx
import React, { useState, useEffect } from "react";
import "../../styles/Sensorial.css";

export default function CazaDeLuz({ volver }) {
  const [jugando, setJugando] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [luces, setLuces] = useState([]);
  const [intervalo, setIntervalo] = useState(3000);

  // área delimitada para generar las luces
  const [areaJuego, setAreaJuego] = useState(null);

  useEffect(() => {
    if (jugando) {
      const gameInterval = setInterval(() => {
        generarLuz();
      }, intervalo);

      const velocidad = setTimeout(() => {
        setIntervalo((prev) => Math.max(1200, prev - 300));
        setNivel((n) => n + 1);
      }, 15000);

      return () => {
        clearInterval(gameInterval);
        clearTimeout(velocidad);
      };
    }
  }, [jugando, intervalo]);

  const generarLuz = () => {
    if (!areaJuego) return;
    const { width, height } = areaJuego.getBoundingClientRect();
    const x = Math.random() * (width - 40);
    const y = Math.random() * (height - 40);
    const id = Date.now();

    const nueva = { id, x, y };
    setLuces((prev) => [...prev, nueva]);

    setTimeout(() => {
      setLuces((prev) => prev.filter((l) => l.id !== id));
    }, 2000);
  };

  const handleLuzClick = (id) => {
    setPuntuacion((prev) => prev + 1);
    setMensaje("🌟 ¡Excelente reflejo!");
    setLuces((prev) => prev.filter((l) => l.id !== id));

    setTimeout(() => setMensaje(""), 1000);
  };

  const iniciarJuego = () => {
    setPuntuacion(0);
    setNivel(1);
    setIntervalo(3000);
    setJugando(true);
    setMensaje("");
  };

  const detenerJuego = () => {
    setJugando(false);
    setMensaje("🎯 Juego terminado. ¡Buen trabajo!");
  };

  return (
    <div className="sensorial-container fade-in">
      <h1 className="sensorial-title">✨ Caza de Luz</h1>
      <p className="sensorial-description">
        Haz clic en las luces que aparecen dentro del cuadro antes de que desaparezcan.
        Empieza despacio, pero con el tiempo ¡irán más rápido!
      </p>

      <div
        className="sensorial-game-area"
        ref={setAreaJuego}
      >
        {luces.map((luz) => (
          <div
            key={luz.id}
            className="sensorial-light"
            style={{ top: luz.y, left: luz.x }}
            onClick={() => handleLuzClick(luz.id)}
          ></div>
        ))}
      </div>

      <div className="sensorial-controls">
        {!jugando ? (
          <button className="sensorial-button" onClick={iniciarJuego}>
            🚀 Comenzar
          </button>
        ) : (
          <button className="sensorial-button detener" onClick={detenerJuego}>
            ⏹ Detener
          </button>
        )}

        <p className="sensorial-score">Puntuación: {puntuacion}</p>
        <p className="sensorial-level">Nivel: {nivel}</p>
        <p className="sensorial-message">{mensaje}</p>

        <button className="sensorial-volver" onClick={volver}>
          ← Volver al módulo sensorial
        </button>
      </div>
    </div>
  );
}
