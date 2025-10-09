import React, { useState, useEffect, useMemo } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import "./ConstruyeRobot.css";
import successSound from "../../assets/sound/success.mp3";
import errorSound from "../../assets/sound/error.mp3";

const ALL_PARTS = [
  { id: "head", label: "Cabeza", src: "/assets/robot/head.png", target: "head-slot" },
  { id: "body", label: "Cuerpo", src: "/assets/robot/body.png", target: "body-slot" },
  { id: "arms", label: "Brazos", src: "/assets/robot/arms.png", target: "arms-slot" },
  { id: "legs", label: "Piernas", src: "/assets/robot/legs.png", target: "legs-slot" },
  { id: "antenna", label: "Antena", src: "/assets/robot/antenna.png", target: "antenna-slot" }, // <-- antes apuntaba a head-slot
  { id: "wheel", label: "Rueda", src: "/assets/robot/wheel.png", target: null },
];



const SLOT_ORDER = ["antenna-slot","head-slot","body-slot","arms-slot","legs-slot"];

export default function ConstruyeRobot({ volver }) {
  const { registrarExito, registrarFallo } = useRegistroActividad();
  const success = new Audio(successSound);
  const fail = new Audio(errorSound);

  const [nivel, setNivel] = useState(1);
  const [colocadas, setColocadas] = useState([]);
  const [mensaje, setMensaje] = useState("¡Arrastra las piezas para construir tu robot!");

  // piezas por nivel
  const piezasNivel = useMemo(() => {
    if (nivel === 1) return [ALL_PARTS[0], ALL_PARTS[1]];
    if (nivel === 2) return [ALL_PARTS[0], ALL_PARTS[1], ALL_PARTS[2]];
    if (nivel === 3) return [ALL_PARTS[0], ALL_PARTS[1], ALL_PARTS[2], ALL_PARTS[3], ALL_PARTS[5]]; // + rueda distractor
    return [ALL_PARTS[0], ALL_PARTS[1], ALL_PARTS[2], ALL_PARTS[3], ALL_PARTS[4], ALL_PARTS[5]];
  }, [nivel]);

  // slots derivados de piezas (ordenados)
  const slotsNivel = useMemo(() => {
    const needed = piezasNivel.filter(p => p.target).map(p => p.target);
    const unique = Array.from(new Set(needed));
    unique.sort((a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b));
    return unique;
  }, [piezasNivel]);

  const handleDrop = (e, target) => {
    e.preventDefault();
    const piezaId = e.dataTransfer.getData("pieza");
    const pieza = piezasNivel.find((p) => p.id === piezaId);

    if (pieza && pieza.target === target && !colocadas.includes(pieza.id)) {
      setColocadas(prev => [...prev, pieza.id]);
      setMensaje("✅ ¡Bien hecho!");
      success.play();
    } else {
      setMensaje("❌ Esa pieza no encaja ahí");
      fail.play();
      registrarFallo("Sensorial", "Construye tu Robot", nivel);
    }
  };

  useEffect(() => {
    if (colocadas.length === slotsNivel.length && slotsNivel.length > 0) {
      setMensaje("🤖 ¡Tu robot está completo!");
      registrarExito("Sensorial", "Construye tu Robot", nivel);
      setTimeout(() => {
        setNivel(n => Math.min(n + 1, 4));
        setColocadas([]);
        setMensaje("¡Arma el nuevo robot!");
      }, 1200);
    }
  }, [colocadas, slotsNivel.length]);

  return (
    <div className="robot-container">
      <h2>🤖 Construye tu Robot — Nivel {nivel}</h2>
      <p className="robot-msg">{mensaje}</p>

        <div className="robot-area">
          <div className="robot-frame-grid">
            {/* ANTENA */}
            {slotsNivel.includes("antenna-slot") && (
              <div
                className={`slot antenna-slot ${colocadas.includes("antenna") ? "filled" : ""}`}
                onDrop={(e) => handleDrop(e, "antenna-slot")}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className="slot-label">Antena</span>
              </div>
            )}

            {/* CABEZA */}
            {slotsNivel.includes("head-slot") && (
              <div
                className={`slot head-slot ${colocadas.includes("head") ? "filled" : ""}`}
                onDrop={(e) => handleDrop(e, "head-slot")}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className="slot-label">Cabeza</span>
              </div>
            )}

            {/* BRAZOS (dos visibles, mismo target) */}
            {slotsNivel.includes("arms-slot") && (
              <>
                <div
                  className={`slot arms-slot left ${colocadas.includes("arms") ? "filled" : ""}`}
                  onDrop={(e) => handleDrop(e, "arms-slot")}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <span className="slot-label">Brazos</span>
                </div>
                <div
                  className={`slot arms-slot right ${colocadas.includes("arms") ? "filled" : ""}`}
                  onDrop={(e) => handleDrop(e, "arms-slot")}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <span className="slot-label">Brazos</span>
                </div>
              </>
            )}

            {/* CUERPO */}
            {slotsNivel.includes("body-slot") && (
              <div
                className={`slot body-slot ${colocadas.includes("body") ? "filled" : ""}`}
                onDrop={(e) => handleDrop(e, "body-slot")}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className="slot-label">Cuerpo</span>
              </div>
            )}

            {/* PIERNAS */}
            {slotsNivel.includes("legs-slot") && (
              <div
                className={`slot legs-slot ${colocadas.includes("legs") ? "filled" : ""}`}
                onDrop={(e) => handleDrop(e, "legs-slot")}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className="slot-label">Piernas</span>
              </div>
            )}
          </div>
        </div>

      <div className="pieza-panel">
        {piezasNivel.map((pieza) => (
          <img
            key={pieza.id}
            src={pieza.src}
            alt={pieza.label}
            title={pieza.label}
            className={`pieza ${colocadas.includes(pieza.id) ? "colocada" : ""} ${pieza.target ? "" : "distractor"}`}
            draggable={!colocadas.includes(pieza.id)}
            onDragStart={(e) => e.dataTransfer.setData("pieza", pieza.id)}
          />
        ))}
      </div>

      <button className="volver-btn" onClick={volver}>⬅ Volver</button>
    </div>
  );
}
