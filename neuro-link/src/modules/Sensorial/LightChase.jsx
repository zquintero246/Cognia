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

  const { registrarExito, registrarFallo } = useRegistroActividad();

  const iniciar = () => {
    setJugando(true);
    setPuntuacion(0);
    setFallos(0);
    setMensaje("");
    setLuces([]);
  };

  // Loop de luces
  useEffect(() => {
    if (!jugando || !areaJuego.current) return;

    intervaloLuces.current = setInterval(generarLuz, intervalo);
    temporizador.current = setTimeout(perderNivel, 15000);

    return () => {
      clearInterval(intervaloLuces.current);
      clearTimeout(temporizador.current);
    };
  }, [jugando, intervalo]);

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

  const handleClick = (id) => {
    setPuntuacion((p) => p + 1);
    setLuces((prev) => prev.filter((l) => l.id !== id));
  };

  const perderNivel = async () => {
    setMensaje("❌ Tiempo agotado o demasiados fallos.");
    clearInterval(intervaloLuces.current);
    clearTimeout(temporizador.current);
    setJugando(false);
    setLuces([]);
    await registrarFallo("Sensorial", "Caza de Luz", nivel);
  };

  const ganarNivel = async () => {
    setMensaje("🎉 ¡Nivel completado!");
    setJugando(false);
    setEnTransicion(true);
    setProgreso(100);

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

  // Evaluar progreso
  useEffect(() => {
    if (!jugando) return;
    if (puntuacion >= objetivo) ganarNivel();
    if (fallos >= 3) perderNivel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntuacion, fallos]);

  const reiniciar = () => {
    clearInterval(intervaloLuces.current);
    clearTimeout(temporizador.current);
    setJugando(false);
    setLuces([]);
    setNivel(1);
    setObjetivo(5);
    setIntervalo(2000);
    setPuntuacion(0);
    setFallos(0);
    setMensaje("");
    setEnTransicion(false);
    setProgreso(100);
  };

  return (
    <div className="chase-screen">
      <div className="chase-panel">
        <h2 className="chase-title">✨ Caza de Luz</h2>
        <p className="chase-subtitle">Haz clic en {objetivo} luces antes del tiempo (máx 3 fallos).</p>

        {enTransicion && (
          <div className="chase-timer">
            <div className="chase-timer-bar" style={{ width: `${progreso}%` }} />
          </div>
        )}

        <div className="actions">
          {!jugando ? (
            <button className="btn btn-primary" onClick={iniciar}>🚀 {mensaje ? "Reintentar" : "Comenzar"}</button>
          ) : (
            <button className="btn btn-secondary" onClick={perderNivel}>⏹ Detener</button>
          )}
          <button className="btn btn-secondary" onClick={reiniciar}>↺ Reiniciar</button>
          <button className="volver-btn" onClick={volver}>← Volver</button>
        </div>

        <div className="chase-area" ref={areaJuego}>
          {luces.map((l) => (
            <div
              key={l.id}
              className="chase-light"
              style={{ top: `${l.y}px`, left: `${l.x}px` }}
              onClick={() => handleClick(l.id)}
              aria-label="Luz objetivo"
            />
          ))}
        </div>

        <div className="chase-stats">
          <p><strong>Nivel:</strong> {nivel}</p>
          <p><strong>Puntos:</strong> {puntuacion}/{objetivo} &nbsp;|&nbsp; <strong>Fallos:</strong> {fallos}/3</p>
          <p className="chase-message">{mensaje}</p>
        </div>
      </div>
    </div>
  );
}
