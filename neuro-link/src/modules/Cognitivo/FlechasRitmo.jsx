import React, { useState, useEffect } from "react";
import "../../styles/FlechasRitmo.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

export default function FlechasRitmo({ volver }) {
  const [flechas, setFlechas] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [total, setTotal] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const direcciones = ["up", "down", "left", "right"];
  const DURACION_JUEGO = 20000; // 20 segundos por ronda
  const { registrarExito, registrarFallo } = useRegistroActividad();

  // Generar flechas
  useEffect(() => {
    let spawnInterval;
    if (jugando) {
      spawnInterval = setInterval(() => {
        const nueva = {
          id: Date.now(),
          dir: direcciones[Math.floor(Math.random() * 4)],
          top: 0,
        };
        setFlechas((prev) => [...prev, nueva]);
        setTotal((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(spawnInterval);
  }, [jugando]);

  // Animar movimiento
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

  // Terminar juego automáticamente
  useEffect(() => {
    let fin;
    if (jugando) {
      fin = setTimeout(() => finalizarJuego(), DURACION_JUEGO);
    }
    return () => clearTimeout(fin);
  }, [jugando]);

  const validar = (dir) => {
    const acierto = flechas.find(
      (f) => f.dir === dir && f.top > 320 && f.top < 400
    );
    if (acierto) {
      setPuntuacion((p) => p + 10);
      setFlechas((prev) => prev.filter((f) => f.id !== acierto.id));
    }
  };

  const finalizarJuego = () => {
    setJugando(false);
    setFinalizado(true);

    const aciertos = puntuacion / 10;
    const ratio = aciertos / total;

    if (ratio >= 0.6) {
      registrarExito("Sensorial", "Pulso musical", 2);
    } else {
      registrarFallo("Sensorial", "Pulso musical", 2);
    }
  };

  const reiniciar = () => {
    setFlechas([]);
    setPuntuacion(0);
    setTotal(0);
    setFinalizado(false);
  };

  return (
    <div className="juego-container">
      <h2 className="titulo-juego">🎵 Flechas del Ritmo</h2>
      <p className="descripcion-juego">
        ¡Presiona la flecha correcta cuando llegue al recuadro! Entrena tu memoria y reflejos.
      </p>

      <div className="zona-juego">
        {flechas.map((f) => (
          <div
            key={f.id}
            className={`flecha ${f.dir}`}
            style={{ top: f.top + "px" }}
          >
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
          <button
            key={d}
            className="boton-control"
            onClick={() => validar(d)}
            disabled={!jugando}
          >
            {d === "up" && "⬆️"}
            {d === "down" && "⬇️"}
            {d === "left" && "⬅️"}
            {d === "right" && "➡️"}
          </button>
        ))}
      </div>

      <h3 className="puntuacion">Puntuación: {puntuacion}</h3>

      {!jugando && !finalizado && (
        <button className="btn-iniciar" onClick={() => setJugando(true)}>
          ▶️ Iniciar Juego
        </button>
      )}

      {jugando && (
        <button className="btn-detener" onClick={() => setJugando(false)}>
          ⏸️ Pausar
        </button>
      )}

      {finalizado && (
        <div className="resultado-final">
          <p>
            {puntuacion / 10 / total >= 0.6
              ? "¡Excelente! Buen ritmo 🎶"
              : "Sigue practicando el ritmo 🥁"}
          </p>
          <button className="btn-reiniciar" onClick={reiniciar}>
            🔄 Jugar de nuevo
          </button>
        </div>
      )}

      <button className="btn-volver" onClick={volver}>
        🔙 Volver al módulo
      </button>
    </div>
  );
}

