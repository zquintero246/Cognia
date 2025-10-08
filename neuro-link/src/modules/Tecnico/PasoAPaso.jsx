import React, { useEffect, useState, useRef } from "react";
import "./PasoAPaso.css";

const PROCESSES = [
  {
    id: "cepillarse",
    title: "Cepillarse los dientes",
    description:
      "Rutina de higiene dental con pasos simples y útiles para mantener la boca limpia.",
    steps: [
      "Mojar el cepillo de dientes",
      "Poner una pequeña cantidad de pasta dental",
      "Cepillar los dientes delanteros y traseros",
      "Cepillar la lengua suavemente",
      "Enjuagarse la boca y guardar el cepillo"
    ],
    explain: [
      "Mojar el cepillo ayuda a preparar las cerdas.",
      "Una cantidad pequeña de pasta es suficiente para limpiar bien.",
      "Cepillar los dientes delanteros y traseros elimina la placa bacteriana.",
      "La lengua acumula bacterias; cepillarla ayuda a mantener el aliento fresco.",
      "Enjuagarse y guardar el cepillo evita contaminación."
    ]
  },
  {
    id: "germinacion",
    title: "Germinación de una semilla",
    description:
      "Aprende cómo una semilla se convierte en una planta. Fomenta la paciencia y la observación.",
    steps: [
      "Llenar una maceta con tierra suelta",
      "Colocar la semilla a la profundidad adecuada",
      "Regar ligeramente la tierra",
      "Poner la maceta en un lugar con luz indirecta",
      "Observar cada día su crecimiento"
    ],
    explain: [
      "La tierra sostiene y alimenta la semilla.",
      "Enterrarla a la profundidad adecuada ayuda a protegerla.",
      "El agua activa el proceso de germinación.",
      "La luz suave favorece el crecimiento sin dañar la semilla.",
      "Observar el proceso enseña sobre el tiempo y el cuidado."
    ]
  },
  {
    id: "lavarse",
    title: "Lavarse las manos correctamente",
    description:
      "Aprende a lavarte las manos correctamente para cuidar tu salud.",
    steps: [
      "Mojar las manos con agua",
      "Aplicar jabón en las palmas",
      "Frotar todas las partes de las manos durante 20 segundos",
      "Enjuagar con agua limpia",
      "Secar con una toalla limpia o al aire"
    ],
    explain: [
      "El agua ayuda a remover la suciedad inicial.",
      "El jabón atrapa los gérmenes y la grasa.",
      "Frotar durante 20 segundos asegura eliminar bacterias.",
      "Enjuagar limpia completamente los residuos de jabón.",
      "Secar evita recontaminación por superficies húmedas."
    ]
  },
  {
    id: "hervir",
    title: "Hervir agua (con supervisión)",
    description:
      "Aprende cómo hervir agua con seguridad y observar el cambio de estado.",
    steps: [
      "Llenar la olla con agua",
      "Colocar la olla sobre la estufa",
      "Encender la estufa con cuidado",
      "Esperar hasta que el agua hierva",
      "Apagar la estufa y retirar la olla"
    ],
    explain: [
      "Medir el agua evita derrames.",
      "Colocar la olla correctamente previene accidentes.",
      "Encender con cuidado enseña sobre seguridad.",
      "El hervor muestra el cambio de líquido a vapor.",
      "Apagar y retirar con cuidado previene quemaduras."
    ]
  },
  {
    id: "sandwich",
    title: "Preparar un sándwich",
    description:
      "Aprende a preparar un sándwich paso a paso, fomentando independencia y motricidad.",
    steps: [
      "Lavar tus manos antes de cocinar",
      "Colocar dos rebanadas de pan sobre la mesa",
      "Poner el relleno (queso, jamón o vegetal)",
      "Tapar con la otra rebanada",
      "Servir y limpiar la mesa"
    ],
    explain: [
      "Lavar las manos evita contaminación.",
      "Preparar los ingredientes enseña orden y anticipación.",
      "Agregar el relleno desarrolla coordinación fina.",
      "Tapar completa la tarea visualmente.",
      "Limpiar refuerza la responsabilidad después de cocinar."
    ]
  }
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PasoAPaso({ volver }) {
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showExplain, setShowExplain] = useState(false);
  const [used, setUsed] = useState(new Set());
  const successRef = useRef(false);

  const process = PROCESSES[index];

  useEffect(() => {
    resetProcess();
  }, [index]);

  const resetProcess = () => {
    setShuffled(shuffle(process.steps.map((s, i) => ({ id: i, text: s }))));
    setSelected([]);
    setUsed(new Set());
    setFeedback("");
    setShowExplain(false);
    successRef.current = false;
  };

  const pickStep = (item) => {
    if (used.has(item.id) || successRef.current) return;
    setSelected([...selected, item]);
    setUsed(new Set([...used, item.id]));
  };

  const removeStep = (pos) => {
    const removed = selected[pos];
    const newSel = selected.filter((_, i) => i !== pos);
    const newUsed = new Set(used);
    newUsed.delete(removed.id);
    setSelected(newSel);
    setUsed(newUsed);
  };

  const validate = () => {
    if (selected.length < process.steps.length) {
      setFeedback("Debes seleccionar todos los pasos.");
      return;
    }
    const correct = process.steps.every((s, i) => selected[i].text === s);
    if (correct) {
      setFeedback("¡Excelente! Los pasos están en orden correcto.");
      successRef.current = true;
      setShowExplain(true);
      const voice = new SpeechSynthesisUtterance("¡Muy bien! Lo lograste.");
      voice.lang = "es-ES";
      window.speechSynthesis.speak(voice);
    } else {
      setFeedback("Algunos pasos no están en orden. Intenta de nuevo.");
    }
  };

  return (
    <div className="paso-container">
      <h2>{process.title}</h2>
      <p>{process.description}</p>

      <div className="paso-controls">
        <label>Variación:</label>
        <select value={index} onChange={(e) => setIndex(parseInt(e.target.value))}>
          {PROCESSES.map((p, i) => (
            <option key={p.id} value={i}>
              {p.title}
            </option>
          ))}
        </select>
        <button onClick={resetProcess}>Reiniciar</button>
      </div>

      <div className="paso-grid">
        <div className="paso-col">
          <h3>Pasos disponibles</h3>
          <div className="chips">
            {shuffled.map((it) => (
              <button
                key={it.id}
                onClick={() => pickStep(it)}
                disabled={used.has(it.id) || successRef.current}
                className={`chip ${used.has(it.id) ? "chip-used" : ""}`}
              >
                {it.text}
              </button>
            ))}
          </div>
        </div>

        <div className="paso-col">
          <h3>Tu orden</h3>
          <ol>
            {selected.map((it, i) => (
              <li key={i}>
                <div className="selected-step">
                  <span>{i + 1}.</span> {it.text}
                  {!successRef.current && (
                    <button onClick={() => removeStep(i)}>✖</button>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <button onClick={validate}>Validar</button>
          <p className="feedback">{feedback}</p>

          {successRef.current && (
            <button onClick={() => setShowExplain(!showExplain)}>
              {showExplain ? "Ocultar explicación" : "Ver explicación"}
            </button>
          )}

          {volver && (
            <button className="volver-btn" onClick={volver}>
              ← Volver
            </button>
          )}
        </div>
      </div>

      {showExplain && (
        <div className="explain-box">
          <h3>Explicación de los pasos</h3>
          <ol>
            {process.steps.map((s, i) => (
              <li key={i}>
                <strong>{s}:</strong> {process.explain[i]}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
