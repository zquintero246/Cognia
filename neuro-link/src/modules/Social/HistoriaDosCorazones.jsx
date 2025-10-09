import React, { useState } from "react";
import "./HistoriaDosCorazones.css";

const ESCENARIOS = [
  {
    texto: "Tu amigo perdió su juguete favorito.",
    emocion: "Triste",
    explicacion: "Cuando perdemos algo importante, podemos sentirnos tristes."
  },
  {
    texto: "Recibiste un regalo que querías mucho.",
    emocion: "Feliz",
    explicacion: "Recibir algo que esperábamos nos hace sentir alegría."
  },
  {
    texto: "Te gritaron sin razón.",
    emocion: "Enojado",
    explicacion: "A veces nos enojamos cuando algo nos parece injusto."
  },
  {
    texto: "Un perro grande corrió hacia ti muy rápido.",
    emocion: "Asustado",
    explicacion: "Podemos sentir miedo ante cosas inesperadas o ruidosas."
  },
  {
    texto: "Tu amigo te compartió su merienda.",
    emocion: "Agradecido",
    explicacion: "Nos sentimos agradecidos cuando alguien es amable con nosotros."
  }
];

export default function HistoriasDosCorazones({ volver }) {
  const [turno, setTurno] = useState(1);
  const [escenarioIndex, setEscenarioIndex] = useState(0);
  const [fase, setFase] = useState("descripcion"); // descripcion o respuesta
  const [seleccion, setSeleccion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [puntajes, setPuntajes] = useState({ jugador1: 0, jugador2: 0 });

  const emociones = ["Feliz", "Triste", "Enojado", "Asustado", "Agradecido"];

  const escenario = ESCENARIOS[escenarioIndex];

  const manejarSeleccion = (emo) => {
    setSeleccion(emo);
    if (emo === escenario.emocion) {
      setFeedback("✅ ¡Correcto! Muy buena empatía.");
      if (turno === 1) {
        setPuntajes((p) => ({ ...p, jugador2: p.jugador2 + 1 }));
      } else {
        setPuntajes((p) => ({ ...p, jugador1: p.jugador1 + 1 }));
      }
    } else {
      setFeedback(`❌ No era ${emo}. La emoción correcta era ${escenario.emocion}.`);
    }
    setFase("resultado");
  };

  const siguienteTurno = () => {
    setSeleccion(null);
    setFeedback("");
    setFase("descripcion");
    setEscenarioIndex((prev) => (prev + 1) % ESCENARIOS.length);
    setTurno(turno === 1 ? 2 : 1);
  };

  return (
    <div className="historias-container">
      <h2>💞 Historias de Dos Corazones</h2>
      <p className="instruccion">
        Turno del Jugador {turno}. Lee la situación y responde.
      </p>

      <div className="escenario-card">
        <h3>Situación:</h3>
        <p>{escenario.texto}</p>
      </div>

      {fase === "descripcion" && (
        <div className="emociones-opciones">
          <p>Jugador {turno === 1 ? "2" : "1"}, elige la emoción correcta:</p>
          <div className="botones-emociones">
            {emociones.map((emo) => (
              <button
                key={emo}
                className={`emocion-btn ${
                  seleccion === emo ? "seleccionado" : ""
                }`}
                onClick={() => manejarSeleccion(emo)}
              >
                {emo}
              </button>
            ))}
          </div>
        </div>
      )}

      {fase === "resultado" && (
        <div className="resultado-box">
          <p>{feedback}</p>
          <p className="explicacion">💡 {escenario.explicacion}</p>
          <button onClick={siguienteTurno} className="siguiente-btn">
            ➡️ Siguiente turno
          </button>
        </div>
      )}

      <div className="puntajes">
        <p>Jugador 1: {puntajes.jugador1} ⭐</p>
        <p>Jugador 2: {puntajes.jugador2} ⭐</p>
      </div>

      <button className="volver-btn" onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}
