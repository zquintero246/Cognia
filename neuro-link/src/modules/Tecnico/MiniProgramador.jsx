import React, { useState, useEffect } from "react";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";
import clickSound from "../../assets/sound/click.mp3";
import "./MiniProgramador.css";

const DIRECCIONES = ["↑", "→", "↓", "←"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MiniProgramador({ volver }) {
  const { registrarExito, registrarFallo } = useRegistroActividad();
  const click = new Audio(clickSound);

  const [objetivo, setObjetivo] = useState({ x: 2, y: 2 });
  const [robot, setRobot] = useState({ x: 0, y: 0 });
  const [programa, setPrograma] = useState([]);
  const [ruta, setRuta] = useState([]);
  const [mensaje, setMensaje] = useState("Selecciona flechas para mover al robot hasta la estrella ⭐");
  const [nivel, setNivel] = useState(1);
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState(false);
  const [obstaculos, setObstaculos] = useState([]);

  const generarObstaculos = (nivelActual) => {
    const cantidad = Math.min(2 + Math.floor(nivelActual / 2), 6); // hasta 6 obstáculos máximo
    const nuevos = [];
    while (nuevos.length < cantidad) {
      const ox = Math.floor(Math.random() * 5);
      const oy = Math.floor(Math.random() * 5);
      // evita colocar sobre robot u objetivo o duplicados
      if (
        (ox !== 0 || oy !== 0) &&
        (ox !== objetivo.x || oy !== objetivo.y) &&
        !nuevos.some((o) => o.x === ox && o.y === oy)
      ) {
        nuevos.push({ x: ox, y: oy });
      }
    }
    setObstaculos(nuevos);
  };

  const nuevoNivel = () => {
    setObjetivo({
      x: Math.floor(Math.random() * 3) + 1,
      y: Math.floor(Math.random() * 3) + 1,
    });
    setRobot({ x: 0, y: 0 });
    setPrograma([]);
    setRuta([]);
    setMensaje("Programa los pasos evitando los obstáculos 🚧");
    setError(false);
    generarObstaculos(nivel);
  };

  useEffect(() => {
    nuevoNivel();
  }, []);

  const agregarPaso = (dir) => {
    if (ejecutando) return;
    click.play();
    setPrograma([...programa, dir]);

    const last = ruta.length ? ruta[ruta.length - 1] : robot;
    let next = { ...last };
    if (dir === "↑") next.y = Math.max(0, next.y - 1);
    if (dir === "↓") next.y = Math.min(4, next.y + 1);
    if (dir === "→") next.x = Math.min(4, next.x + 1);
    if (dir === "←") next.x = Math.max(0, next.x - 1);

    // no mostrar paso sobre obstáculo
    if (!obstaculos.some((o) => o.x === next.x && o.y === next.y)) {
      setRuta([...ruta, { ...next, dir }]);
    }
  };

  const ejecutarPrograma = async () => {
    setEjecutando(true);
    setMensaje("🚀 Ejecutando programa...");
    let pos = { ...robot };
    let choco = false;

    for (let paso of programa) {
      await sleep(500);
      if (paso === "↑") pos.y = Math.max(0, pos.y - 1);
      if (paso === "↓") pos.y = Math.min(4, pos.y + 1);
      if (paso === "→") pos.x = Math.min(4, pos.x + 1);
      if (paso === "←") pos.x = Math.max(0, pos.x - 1);

      // si choca con obstáculo
      if (obstaculos.some((o) => o.x === pos.x && o.y === pos.y)) {
        choco = true;
        break;
      }

      setRobot({ ...pos });
    }

    const exito = !choco && pos.x === objetivo.x && pos.y === objetivo.y;

    if (exito) {
      setMensaje("✅ ¡Excelente, mini programador!");
      registrarExito("Cognitivo", "Mini Programador", nivel);
      setNivel((n) => n + 1);
    } else if (choco) {
      setMensaje("💥 El robot chocó con un obstáculo. Intenta otro camino.");
      setError(true);
      registrarFallo("Cognitivo", "Mini Programador", nivel);
    } else {
      setMensaje("❌ El robot no llegó al objetivo, inténtalo de nuevo.");
      setError(true);
      registrarFallo("Cognitivo", "Mini Programador", nivel);
    }

    setEjecutando(false);
    await sleep(1200);
    nuevoNivel();
  };

  return (
    <div className="programador-container">
      <h2>🤖 Mini Programador — Nivel {nivel}</h2>
      <p className={`mensaje ${error ? "error" : ""}`}>{mensaje}</p>

      <div className="grid">
        {[...Array(5)].map((_, y) => (
          <div key={y} className="fila">
            {[...Array(5)].map((_, x) => {
              const isRobot = robot.x === x && robot.y === y;
              const isObjetivo = objetivo.x === x && objetivo.y === y;
              const isObstaculo = obstaculos.some((o) => o.x === x && o.y === y);
              const paso = ruta.find((r) => r.x === x && r.y === y);

              return (
                <div
                  key={x}
                  className={`celda ${isRobot ? "robot" : ""} ${
                    isObjetivo ? "objetivo" : ""
                  } ${isObstaculo ? "obstaculo" : ""}`}
                >
                  {isRobot
                    ? "🤖"
                    : isObjetivo
                    ? "⭐"
                    : isObstaculo
                    ? "🚧"
                    : paso
                    ? paso.dir
                    : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="botones-direccion">
          {DIRECCIONES.map((d) => (
            <button
              key={d}
              onClick={() => agregarPaso(d)}
              disabled={ejecutando}
              className="dir-btn"
            >
              {d}
            </button>
          ))}
        </div>

        <div className="programa">
          {programa.map((p, i) => (
            <span key={i} className="paso">
              {p}
            </span>
          ))}
        </div>

        <button
          className="ejecutar-btn"
          onClick={ejecutarPrograma}
          disabled={ejecutando || programa.length === 0}
        >
          ▶ Ejecutar
        </button>
      </div>


    </div>
  );
}
