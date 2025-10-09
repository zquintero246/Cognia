import React, { useEffect, useMemo, useState } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./TeEntiendo.css";
import successSound from "../../assets/sound/success.mp3";
import errorSound from "../../assets/sound/error.mp3";

/**
 * Dinámica:
 * - Ronda cooperativa por turnos:
 *   1) Jugador A elige la EMOCIÓN del personaje.
 *   2) Jugador B elige la ACCIÓN empática adecuada.
 * - Si ambos aciertan => éxito de la ronda, sube el nivel.
 * - Si fallan en cualquiera, se repite la ronda con otra escena del mismo nivel.
 * Accesibilidad: toggle "Mostrar texto" debajo de los pictos.
 */

const SCENES = [
  {
    id: "caida",
    img: "/assets/pictos/scene_fall.svg", // placeholder
    emotions: [
      { id: "sad", img: "/assets/pictos/emo_sad.svg", label: "Triste" },
      { id: "angry", img: "/assets/pictos/emo_angry.svg", label: "Molesto" },
      { id: "happy", img: "/assets/pictos/emo_happy.svg", label: "Contento" }
    ],
    correctEmotion: "sad",
    actions: [
      { id: "help_up", img: "/assets/pictos/act_helpup.svg", label: "Ayudar a levantarse" },
      { id: "laugh", img: "/assets/pictos/act_laugh.svg", label: "Reírse" },
      { id: "ignore", img: "/assets/pictos/act_ignore.svg", label: "Ignorar" }
    ],
    validActions: ["help_up"]
  },
  {
    id: "solo",
    img: "/assets/pictos/scene_alone.svg",
    emotions: [
      { id: "sad", img: "/assets/pictos/emo_sad.svg", label: "Triste" },
      { id: "fear", img: "/assets/pictos/emo_fear.svg", label: "Asustado" },
      { id: "happy", img: "/assets/pictos/emo_happy.svg", label: "Contento" }
    ],
    correctEmotion: "sad",
    actions: [
      { id: "invite", img: "/assets/pictos/act_invite.svg", label: "Invitar a jugar" },
      { id: "push", img: "/assets/pictos/act_push.svg", label: "Empujar" },
      { id: "ignore", img: "/assets/pictos/act_ignore.svg", label: "Ignorar" }
    ],
    validActions: ["invite"]
  },
  {
    id: "compartir",
    img: "/assets/pictos/scene_share.svg",
    emotions: [
      { id: "happy", img: "/assets/pictos/emo_happy.svg", label: "Contento" },
      { id: "angry", img: "/assets/pictos/emo_angry.svg", label: "Molesto" },
      { id: "sad", img: "/assets/pictos/emo_sad.svg", label: "Triste" }
    ],
    correctEmotion: "happy",
    actions: [
      { id: "say_thanks", img: "/assets/pictos/act_thanks.svg", label: "Dar las gracias" },
      { id: "take_away", img: "/assets/pictos/act_takeaway.svg", label: "Quitarle el juguete" },
      { id: "ignore", img: "/assets/pictos/act_ignore.svg", label: "Ignorar" }
    ],
    validActions: ["say_thanks"]
  }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function TeEntiendo({ volver }) {
  const { registrarExito, registrarFallo } = useRegistroActividad();
  const [nivel, setNivel] = useState(1);
  const [showText, setShowText] = useState(false);
  const [round, setRound] = useState(null); // {scene, step, pickedEmotion}
  const [locked, setLocked] = useState(false);
  const success = useMemo(() => new Audio(successSound), []);
  const fail = useMemo(() => new Audio(errorSound), []);

  // construye ronda con ligera progresión (niveles altos eligen entre más opciones)
  const buildRound = (lvl) => {
    const scene = SCENES[Math.floor(Math.random() * SCENES.length)];
    // dificultad: a mayor nivel, agregamos un distractor extra (si hay)
    const plus = Math.min(1 + Math.floor(lvl / 2), 2); // 1..2
    const emotions = scene.emotions.slice(0, Math.min(scene.emotions.length, 2 + plus)); // 3-4
    const actions = scene.actions.slice(0, Math.min(scene.actions.length, 2 + plus));    // 3-4
    return { scene: { ...scene, emotions, actions }, step: 1, pickedEmotion: null };
  };

  useEffect(() => {
    setRound(buildRound(nivel));
    setLocked(false);
  }, [nivel]);

  const pickEmotion = async (id) => {
    if (!round || locked || round.step !== 1) return;
    setLocked(true);
    const ok = id === round.scene.correctEmotion;
    flashBtn(`emo-${id}`, ok);
    if (ok) {
      await sleep(400);
      setRound((r) => ({ ...r, step: 2, pickedEmotion: id }));
      setLocked(false);
    } else {
      await onFail();
    }
  };

  const pickAction = async (id) => {
    if (!round || locked || round.step !== 2) return;
    setLocked(true);
    const ok = round.scene.validActions.includes(id);
    flashBtn(`act-${id}`, ok);
    if (ok) {
      success.play();
      registrarExito("Social", "Te entiendo (cooperativo)", nivel);
      await sleep(800);
      setNivel((n) => Math.min(n + 1, 5));
    } else {
      await onFail();
    }
  };

  const onFail = async () => {
    fail.play();
    registrarFallo("Social", "Te entiendo (cooperativo)", nivel);
    await sleep(700);
    setRound(buildRound(nivel));
    setLocked(false);
  };

  const flashBtn = (id, ok) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add(ok ? "ok" : "bad");
    setTimeout(() => el.classList.remove(ok ? "ok" : "bad"), 520);
  };

  if (!round) return null;

  return (
    <div className="ti-container">
      <div className="ti-header">
        <h2>🤝 Te entiendo — Nivel {nivel}</h2>
        <label className="ti-switch">
          <input type="checkbox" checked={showText} onChange={() => setShowText(v => !v)} />
          <span>Mostrar texto</span>
        </label>
      </div>

      {/* Escena central */}
      <div className="ti-scene">
        <img src={round.scene.img} alt="Escena" className="ti-scene-img" draggable={false}/>
      </div>

      {/* Paso 1: Jugador A elige emoción */}
      <div className={`ti-step ${round.step === 1 ? "active" : ""}`}>
        <div className="ti-step-title">
          <span className="ti-badge">A</span> Elige la emoción
        </div>
        <div className="ti-grid">
          {round.scene.emotions.map(e => (
            <button
              id={`emo-${e.id}`}
              key={e.id}
              className="ti-card"
              onClick={() => pickEmotion(e.id)}
              aria-label={e.label}
            >
              <img src={e.img} alt={e.label} className="ti-picto" draggable={false}/>
              {showText && <span className="ti-label">{e.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2: Jugador B elige acción */}
      <div className={`ti-step ${round.step === 2 ? "active" : ""}`}>
        <div className="ti-step-title">
          <span className="ti-badge">B</span> Elige una acción empática
        </div>
        <div className="ti-grid">
          {round.scene.actions.map(a => (
            <button
              id={`act-${a.id}`}
              key={a.id}
              className="ti-card"
              onClick={() => pickAction(a.id)}
              aria-label={a.label}
            >
              <img src={a.img} alt={a.label} className="ti-picto" draggable={false}/>
              {showText && <span className="ti-label">{a.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
