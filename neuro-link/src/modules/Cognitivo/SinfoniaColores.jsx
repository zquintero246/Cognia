import React, { useState, useEffect } from "react";
import "../../styles/SinfoniaColores.css";

export default function SinfoniaColores({ volver }) {
  const colores = [
    { nombre: "rojo", color: "#ff6b6b", sonido: 261.6 },
    { nombre: "azul", color: "#4dabf7", sonido: 329.6 },
    { nombre: "verde", color: "#51cf66", sonido: 392.0 },
    { nombre: "amarillo", color: "#ffd43b", sonido: 523.3 },
  ];

  const [secuencia, setSecuencia] = useState([]);
  const [jugada, setJugada] = useState([]);
  const [nivel, setNivel] = useState(0);
  const [bloquear, setBloquear] = useState(false);
  const [mensaje, setMensaje] = useState("Presiona empezar para jugar 🎶");

  // Función para reproducir sonido
  const reproducirSonido = (frecuencia) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    osc.frequency.value = frecuencia;
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  };

  // Reproduce la secuencia actual
  const reproducirSecuencia = async (arr) => {
    setBloquear(true);
    for (let i = 0; i < arr.length; i++) {
      const colorObj = colores.find((c) => c.nombre === arr[i]);
      iluminarColor(colorObj.nombre);
      reproducirSonido(colorObj.sonido);
      await new Promise((res) => setTimeout(res, 600));
    }
    setBloquear(false);
  };

  // Efecto visual del color
  const iluminarColor = (nombre) => {
    const el = document.getElementById(nombre);
    if (el) {
      el.classList.add("activo");
      setTimeout(() => el.classList.remove("activo"), 300);
    }
  };

  // Iniciar el juego
  const iniciarJuego = () => {
    setSecuencia([]);
    setNivel(0);
    setMensaje("Escucha y repite la secuencia 🎨");
    siguienteNivel([]);
  };

  // Añadir un color nuevo a la secuencia
  const siguienteNivel = async (anterior) => {
    const nuevo = [...anterior, colores[Math.floor(Math.random() * colores.length)].nombre];
    setSecuencia(nuevo);
    setNivel(nuevo.length);
    setJugada([]);
    await new Promise((res) => setTimeout(res, 800));
    reproducirSecuencia(nuevo);
  };

  // Click del jugador
  const manejarClick = async (nombre) => {
    if (bloquear) return;
    reproducirSonido(colores.find((c) => c.nombre === nombre).sonido);
    iluminarColor(nombre);
    const nuevaJugada = [...jugada, nombre];
    setJugada(nuevaJugada);

    // Validar la jugada
    for (let i = 0; i < nuevaJugada.length; i++) {
      if (nuevaJugada[i] !== secuencia[i]) {
        setMensaje("❌ Ups, intenta de nuevo.");
        return;
      }
    }

    if (nuevaJugada.length === secuencia.length) {
      setMensaje("✅ ¡Bien hecho! Vamos al siguiente nivel.");
      setTimeout(() => siguienteNivel(secuencia), 1200);
    }
  };

  return (
    <div className="sinfonia-container fade-in">
      <h1 className="sinfonia-titulo">🎵 Sinfonía de Colores</h1>
      <p className="sinfonia-mensaje">{mensaje}</p>
      <p className="sinfonia-nivel">Nivel: {nivel}</p>

      <div className="sinfonia-grid">
        {colores.map((c) => (
          <div
            key={c.nombre}
            id={c.nombre}
            className="color-circulo"
            style={{ backgroundColor: c.color }}
            onClick={() => manejarClick(c.nombre)}
          />
        ))}
      </div>

      <div className="sinfonia-botones">
        <button className="boton-jugar" onClick={iniciarJuego}>
          ▶ Empezar
        </button>
        <button className="boton-volver" onClick={volver}>
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
