import React, { useEffect, useMemo, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./EncuentraError.css";
import successSound from "../../assets/sound/success.mp3";
import errorSound from "../../assets/sound/error.mp3";

/**
 * Estructura de escenario:
 *  - steps: array de objetos con { img, alt, label }
 *  - wrongPool: pictos alternativos para reemplazar 1 paso correcto (el "error")
 * Coloca tus imágenes en /assets/pictos/... (pueden ser SVG o PNG).
 */

const SCENARIOS = [
  {
    name: "Semáforo peatonal",
    emoji: "🚦",
    steps: [
      { img: "/assets/pictos/stop.png",     alt: "Detenerse",           label: "Detenerse" },
      { img: "/assets/pictos/look.png",     alt: "Mirar a lados",       label: "Mirar" },
      { img: "/assets/pictos/greenwalk.png",alt: "Luz verde caminar",   label: "Luz verde" },
      { img: "/assets/pictos/walk.png",     alt: "Cruzar",              label: "Cruzar" },
    ],
    wrongPool: [
      { img: "/assets/pictos/redwalk.png", alt: "Cruzar con rojo", label: "Rojo" },
      { img: "/assets/pictos/headphones.png", alt: "Audífonos alto", label: "Ruido" },
      { img: "/assets/pictos/run.png", alt: "Correr imprudente", label: "Correr" },
    ],
  },
  {
    name: "Lavar manos",
    emoji: "🧼",
    steps: [
      { img: "/assets/pictos/tap-on.png",  alt: "Abrir grifo",  label: "Abrir" },
      { img: "/assets/pictos/wet.png",     alt: "Mojar manos",  label: "Mojar" },
      { img: "/assets/pictos/soap.png",    alt: "Jabón",        label: "Jabón" },
      { img: "/assets/pictos/rinse.png",   alt: "Enjuagar",     label: "Enjuagar" },
      { img: "/assets/pictos/dry.png",     alt: "Secar",        label: "Secar" },
    ],
    wrongPool: [
      { img: "/assets/pictos/dry-first.png",  alt: "Secar antes", label: "Antes" },
      { img: "/assets/pictos/tap-off.png",    alt: "Cerrar al inicio", label: "Cerrar" },
      { img: "/assets/pictos/dirt.png",       alt: "Ensuciar manos", label: "Ensuciar" },
    ],
  },
  {
    name: "Encender lámpara",
    emoji: "💡",
    steps: [
      { img: "/assets/pictos/plug-in.png", alt: "Conectar",  label: "Conectar" },
      { img: "/assets/pictos/switch-on.png", alt: "Interruptor", label: "Encender" },
      { img: "/assets/pictos/light-on.png", alt: "Luz encendida", label: "Luz" },
    ],
    wrongPool: [
      { img: "/assets/pictos/unplug.png",     alt: "Desconectar", label: "Desconectar" },
      { img: "/assets/pictos/cover-bulb.png", alt: "Tapar foco",  label: "Tapar" },
      { img: "/assets/pictos/wet-plug.png",   alt: "Mojar enchufe", label: "Mojar" },
    ],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function VisualEncuentraError({ volver }) {
  const { registrarExito, registrarFallo } = useRegistroActividad();
  const [nivel, setNivel] = useState(1);
  const [round, setRound] = useState(null); // { scenario, tiles[], wrongIndex }
  const [locked, setLocked] = useState(false);
  const [showText, setShowText] = useState(false);
  const success = useMemo(() => new Audio(successSound), []);
  const fail = useMemo(() => new Audio(errorSound), []);

  // construye ronda con más pasos/ambigüedad según nivel
  const buildRound = (lvl) => {
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    // longitud objetivo por nivel
    const targetLen = Math.min(5, Math.max(3, 2 + lvl)); // 3..5
    let steps = [...scenario.steps];

    // recorta o rellena duplicando un paso neutro (visualmente igual)
    if (steps.length > targetLen) steps = steps.slice(0, targetLen);
    if (steps.length < targetLen) {
      while (steps.length < targetLen) steps.splice(steps.length - 1, 0, steps[1] || steps[0]);
    }

    // dificultad: a mayor nivel, el “error” será más parecido al correcto (elige wrongPool al azar).
    const wrongIndex = Math.floor(Math.random() * steps.length);
    const wrongAlt = scenario.wrongPool[Math.floor(Math.random() * scenario.wrongPool.length)];

    const tiles = steps.map((s, i) => (i === wrongIndex ? wrongAlt : s));
    return { scenario, tiles, wrongIndex };
  };

  useEffect(() => {
    setRound(buildRound(nivel));
    setLocked(false);
  }, [nivel]);

  const handlePick = async (idx) => {
    if (!round || locked) return;
    setLocked(true);

    const isWrong = idx === round.wrongIndex;
    const el = document.getElementById(`vstep-${idx}`);
    if (el) el.classList.add(isWrong ? "ok" : "bad");

    if (isWrong) {
      success.play();
      registrarExito("Cognitivo", "Encuentra el Error (Visual)", nivel);
      await sleep(900);
      setNivel((n) => Math.min(n + 1, 5));
    } else {
      fail.play();
      registrarFallo("Cognitivo", "Encuentra el Error (Visual)", nivel);
      await sleep(900);
      // nueva ronda mismo nivel
      setRound(buildRound(nivel));
      setLocked(false);
    }
  };

  if (!round) return null;

  return (
    <div className="ve-container">
      <div className="ve-top">
        <h2>🕵️ Encuentra el error — Nivel {nivel}</h2>
        <div className="ve-toggles">
          <label className="ve-switch">
            <input type="checkbox" checked={showText} onChange={() => setShowText(v => !v)} />
            <span>Mostrar texto</span>
          </label>
        </div>
      </div>

      <div className="ve-scene">
        <span className="ve-scene-badge">{round.scenario.emoji}</span>
        <span className="ve-scene-title">{round.scenario.name}</span>
      </div>

      <div className="ve-grid">
        {round.tiles.map((t, i) => (
          <button
            id={`vstep-${i}`}
            key={i}
            className="ve-card"
            onClick={() => handlePick(i)}
            aria-label={t.alt}
          >
            <img src={t.img} alt={t.alt} className="ve-picto" draggable={false} />
            {showText && <span className="ve-label">{t.label}</span>}
            <span className="ve-mark ve-ok">✓</span>
            <span className="ve-mark ve-bad">✗</span>
          </button>
        ))}
      </div>

      <button className="volver-btn" onClick={volver}>⬅ Volver</button>
    </div>
  );
}
