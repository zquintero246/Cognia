import React, { useEffect, useState, useRef } from "react";
import "./PasoAPaso.css";

/*
  PasoAPaso.jsx (mejorado)
  Props:
    - volver: función opcional para volver al menú
    - dificultad: "facil" | "normal" | "dificil" (default: "normal")
    - onResult: función opcional(result) donde result = {
        processId, difficulty, attempts, hintsUsed, timeSpentMs, success
      }
*/

const PROCESSES = [
  /* (mismos procesos que ya tenías) */
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

export default function PasoAPaso({ volver, dificultad = "normal", onResult }) {
  const [index, setIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState([]); // {id, text, correctIndex|null}
  const [selected, setSelected] = useState([]); // array of items
  const [feedback, setFeedback] = useState("");
  const [showExplain, setShowExplain] = useState(false);
  const [usedIds, setUsedIds] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const startRef = useRef(null);
  const successRef = useRef(false);

  const process = PROCESSES[index];

  // calcula la secuencia correcta según dificultad
  function getCorrectSequence(proc, nivel) {
    const total = proc.steps.length;
    if (nivel === "facil") {
      // tomamos primeros 3 pasos o menos si el proceso es corto
      const n = Math.max(2, Math.min(3, total));
      return proc.steps.slice(0, n);
    }
    // normal -> todos los pasos
    if (nivel === "normal") return proc.steps.slice();
    // dificil -> todos los pasos (pero luego añadimos decoys)
    return proc.steps.slice();
  }

  // crea el banco de botones (correctos + decoys opcionales)
  function buildItems(proc, nivel) {
    const correctSeq = getCorrectSequence(proc, nivel);
    let items = correctSeq.map((text, i) => ({
      id: `c-${i}`,
      text,
      correctIndex: i
    }));

    // para dificil, añadimos 1-2 decoys tomados de otros procesos
    if (nivel === "dificil") {
      const decoyPool = PROCESSES.flatMap((p) => p.steps).filter(
        (s) => !proc.steps.includes(s)
      );
      const decoysNeeded = Math.min(2, Math.max(1, Math.floor(correctSeq.length / 3)));
      const chosen = shuffle(decoyPool).slice(0, decoysNeeded);
      const decoyItems = chosen.map((t, i) => ({
        id: `d-${i}`,
        text: t,
        correctIndex: null
      }));
      items = items.concat(decoyItems);
    }

    return shuffle(items);
  }

  // reinicia proceso -> reconstruye items y métricas
  const resetProcess = () => {
    const items = buildItems(process, dificultad);
    setShuffledItems(items);
    setSelected([]);
    setUsedIds(new Set());
    setFeedback("");
    setShowExplain(false);
    setAttempts(0);
    setHintsUsed(0);
    successRef.current = false;
    startRef.current = Date.now();
  };

  useEffect(() => {
    resetProcess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, dificultad]);

  // cuantos pasos correctos se esperan
  const correctSequence = getCorrectSequence(process, dificultad);

  const pickStep = (item) => {
    if (successRef.current) return;
    if (usedIds.has(item.id)) return;
    // limitar selección al número de pasos correctos (reduce confusión)
    if (selected.length >= correctSequence.length) {
      setFeedback("Has seleccionado el número máximo de pasos. Quita uno si quieres cambiar.");
      return;
    }
    setSelected((prev) => [...prev, item]);
    setUsedIds((prev) => {
      const n = new Set(prev);
      n.add(item.id);
      return n;
    });
    setFeedback("");
  };

  const removeStep = (pos) => {
    if (successRef.current) return;
    const removed = selected[pos];
    const newSel = selected.filter((_, i) => i !== pos);
    setSelected(newSel);
    setUsedIds((prev) => {
      const n = new Set(prev);
      if (removed) n.delete(removed.id);
      return n;
    });
    setFeedback("");
  };

  // dar una pista: seleccionar automáticamente el siguiente paso correcto
  const giveHint = () => {
    if (successRef.current) return;
    const nextIndex = selected.length; // índice de siguiente paso requerido
    if (nextIndex >= correctSequence.length) {
      setFeedback("Ya seleccionaste todos los pasos requeridos.");
      return;
    }
    const nextText = correctSequence[nextIndex];
    const item = shuffledItems.find((it) => it.text === nextText && !usedIds.has(it.id));
    if (item) {
      setSelected((prev) => [...prev, item]);
      setUsedIds((prev) => {
        const n = new Set(prev);
        n.add(item.id);
        return n;
      });
      setHintsUsed((h) => h + 1);
      setFeedback("Pista aplicada: se seleccionó el siguiente paso correcto.");
    } else {
      setFeedback("No se pudo encontrar la pista (intenta mezclar).");
    }
  };

  const shuffleUnselected = () => {
    // mantiene los seleccionados, reordena los demás
    const selectedIds = selected.map((s) => s.id);
    const unselected = shuffledItems.filter((it) => !selectedIds.includes(it.id));
    const newOrder = shuffle(unselected).concat(shuffledItems.filter((it) => selectedIds.includes(it.id)));
    setShuffledItems(newOrder);
  };

  const validate = () => {
    if (selected.length < correctSequence.length) {
      setFeedback("Debes seleccionar todos los pasos requeridos antes de validar.");
      return;
    }
    setAttempts((a) => a + 1);
    // comprobar que los pasos seleccionados (en orden) coinciden con la secuencia correcta
    let ok = true;
    for (let i = 0; i < correctSequence.length; i++) {
      if (!selected[i] || selected[i].text !== correctSequence[i]) {
        ok = false;
        break;
      }
    }

    const timeSpentMs = Date.now() - (startRef.current || Date.now());

    if (ok) {
      setFeedback("¡Excelente! Los pasos están en orden correcto.");
      successRef.current = true;
      setShowExplain(true);
      // hablar feedback
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voice = new SpeechSynthesisUtterance("¡Muy bien! Lo lograste.");
        voice.lang = "es-ES";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(voice);
      }
      // resultado para IA/backend
      if (typeof onResult === "function") {
        onResult({
          processId: process.id,
          difficulty: dificultad,
          attempts: attempts + 1,
          hintsUsed,
          timeSpentMs,
          success: true
        });
      }
    } else {
      setFeedback("Algunos pasos no están en orden. Intenta de nuevo.");
      // reporte parcial
      if (typeof onResult === "function") {
        onResult({
          processId: process.id,
          difficulty: dificultad,
          attempts: attempts + 1,
          hintsUsed,
          timeSpentMs,
          success: false
        });
      }
    }
  };

  return (
    <div className="paso-container">
      <h2>{process.title}</h2>
      <p>{process.description}</p>

      <div className="paso-controls">
        <label>Variación:</label>
        <select value={index} onChange={(e) => setIndex(parseInt(e.target.value, 10))}>
          {PROCESSES.map((p, i) => (
            <option key={p.id} value={i}>
              {p.title}
            </option>
          ))}
        </select>

        <label> Dificultad: </label>
        <select value={dificultad} onChange={(e) => {
          // si la dificultad viene de props (inmutable), esta línea no la cambiará.
          // Se incluye para debug local; en integración real la dificultad la pasa la IA.
          // eslint-disable-next-line no-console
          console.warn("Para cambiar dificultad de forma permanente, pásala via prop 'dificultad' desde el padre.");
        }} disabled>
          <option>{dificultad}</option>
        </select>

        <button onClick={resetProcess}>Reiniciar</button>
        <button onClick={shuffleUnselected}>Mezclar no seleccionados</button>
        <button onClick={giveHint}>Pista</button>
      </div>

      <div className="paso-grid">
        <div className="paso-col">
          <h3>Pasos disponibles</h3>
          <div className="chips">
            {shuffledItems.map((it) => (
              <button
                key={it.id}
                onClick={() => pickStep(it)}
                disabled={usedIds.has(it.id) || successRef.current}
                className={`chip ${usedIds.has(it.id) ? "chip-used" : ""}`}
                aria-pressed={usedIds.has(it.id)}
              >
                {it.text}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
            Selecciona {correctSequence.length} pasos en orden.
          </p>
        </div>

        <div className="paso-col">
          <h3>Tu orden</h3>
          <ol>
            {selected.map((it, i) => (
              <li key={it.id + "-" + i}>
                <div className="selected-step">
                  <span>{i + 1}.</span> {it.text}
                  {!successRef.current && (
                    <button onClick={() => removeStep(i)}>✖</button>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={validate}>Validar</button>
            <button onClick={resetProcess}>Limpiar</button>
          </div>

          <p className="feedback">{feedback}</p>

          <div style={{ marginTop: 10, fontSize: 13, color: "#444" }}>
            <div>Intentos: {attempts}</div>
            <div>Pistas usadas: {hintsUsed}</div>
          </div>

          {successRef.current && (
            <button onClick={() => setShowExplain((s) => !s)}>
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
            {correctSequence.map((s, i) => (
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

