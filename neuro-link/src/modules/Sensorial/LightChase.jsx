// src/modules/Sensorial/CazaDeLuz.js
import React, { useState, useEffect, useRef } from "react";
import "./LightChase.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

export default function CazaDeLuz({ volver }) {
  const [jugando, setJugando] = useState(false);
  const [nivel, setNivel] = useState(1);
  const [puntuacion, setPuntuacion] = useState(0);
  const [objetivo, setObjetivo] = useState(5);
  const [fallos, setFallos] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [luces, setLuces] = useState([]);
  const [intervalo, setIntervalo] = useState(2000);
  const [progreso, setProgreso] = useState(100);
  const [enTransicion, setEnTransicion] = useState(false);

  const areaJuego = useRef(null);
  const temporizador = useRef(null);
  const intervaloLuces = useRef(null);

  // Hook para registrar éxitos y fallos
  const { registrarExito, registrarFallo } = useRegistroActividad();

  // 🔹 Iniciar juego
  const iniciar = () => {
    setJugando(true);
    setPuntuacion(0);
    setFallos(0);
    setMensaje("");
    setLuces([]);
  };

  // 🔹 Loop de luces
  useEffect(() => {
    if (!jugando || !areaJuego.current) return;

    intervaloLuces.current = setInterval(generarLuz, intervalo);
    temporizador.current = setTimeout(perderNivel, 15000);

    return () => {
      clearInterval(intervaloLuces.current);
      clearTimeout(temporizador.current);
    };
  }, [jugando, intervalo]);

  // 🔹 Generar luz dentro del área
  const generarLuz = () => {
    const area = areaJuego.current?.getBoundingClientRect();
    if (!area) return;

    const x = Math.random() * (area.width - 60) + 10;
    const y = Math.random() * (area.height - 60) + 10;
    const id = crypto.randomUUID();

    setLuces((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setLuces((prev) => {
        const existe = prev.some((l) => l.id === id);
        if (existe) {
          setFallos((f) => f + 0.5);
          return prev.filter((l) => l.id !== id);
        }
        return prev;
      });
    }, 1000);
  };

  // 🔹 Click en luz
  const handleClick = (id) => {
    setPuntuacion((p) => p + 1);
    setLuces((prev) => prev.filter((l) => l.id !== id));
  };

  // 🔹 Perder nivel
  const perderNivel = async () => {
    setMensaje("❌ Tiempo agotado o demasiados fallos.");
    clearInterval(intervaloLuces.current);
    clearTimeout(temporizador.current);
    setJugando(false);
    setLuces([]);

    // 📊 Registrar fallo en la BD
    await registrarFallo("Sensorial", "Caza de Luz", nivel);
  };

  // 🔹 Ganar nivel
  const ganarNivel = async () => {
    setMensaje("🎉 ¡Nivel completado!");
    setJugando(false);
    setEnTransicion(true);
    setProgreso(100);

    // 📊 Registrar éxito en la BD
    await registrarExito("Sensorial", "Caza de Luz", nivel);

    let countdown = 100;
    const intervaloTimer = setInterval(() => {
      countdown -= 2;
      setProgreso(countdown);
      if (countdown <= 0) {
        clearInterval(intervaloTimer);
        setEnTransicion(false);
        setNivel((n) => n + 1);
        setIntervalo((i) => Math.max(800, i - 200));
        setObjetivo((o) => o + 3);
        iniciar();
      }
    }, 60);
  };

  // 🔹 Evaluar progreso
  useEffect(() => {
    if (!jugando) return;
    if (puntuacion >= objetivo) ganarNivel();
    if (fallos >= 3) perderNivel();
  }, [puntuacion, fallos]);

  return (
    <div className="sensorial-container fade-in">
      <h1 className="sensorial-title">✨ Caza de Luz</h1>
      <p>Haz clic en {objetivo} luces antes del tiempo (máx 3 fallos).</p>

      {enTransicion && (
        <div className="sensorial-timer">
          <div
            className="sensorial-timer-bar"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
      )}

      <div className="sensorial-game-area" ref={areaJuego}>
        {luces.map((l) => (
          <div
            key={l.id}
            className="sensorial-light"
            style={{ top: `${l.y}px`, left: `${l.x}px`, position: "absolute" }}
            onClick={() => handleClick(l.id)}
          ></div>
        ))}
      </div>

      <div className="sensorial-controls">
        <p>Nivel: {nivel}</p>
        <p>
          Puntos: {puntuacion}/{objetivo} | Fallos: {fallos}/3
        </p>
        <p className="sensorial-message">{mensaje}</p>

        {!jugando ? (
          <button className="sensorial-button" onClick={iniciar}>
            🚀 {mensaje ? "Reintentar" : "Comenzar"}
          </button>
        ) : (
          <button className="sensorial-button detener" onClick={perderNivel}>
            ⏹ Detener
          </button>
        )}
        <button className="sensorial-volver" onClick={volver}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

