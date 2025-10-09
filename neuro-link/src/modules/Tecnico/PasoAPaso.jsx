import React, { useEffect, useState, useRef } from "react";
import "./PasoAPaso.css";

const PROCESSES = [
  {
    id: "cepillarse",
    title: "Cepillarse los dientes",
    description: "Rutina de higiene dental con pasos simples.",
    steps: [
      "Mojar el cepillo de dientes",
      "Poner una pequeña cantidad de pasta dental",
      "Cepillar los dientes delanteros y traseros",
      "Cepillar la lengua suavemente",
      "Enjuagarse la boca y guardar el cepillo"
    ],
    explain: [
      "Mojar el cepillo ayuda a preparar las cerdas.",
      "Una cantidad pequeña de pasta es suficiente.",
      "Cepillar elimina la placa bacteriana.",
      "La lengua acumula bacterias; cepillarla ayuda.",
      "Enjuagar y guardar evita contaminación."
    ]
  },
  {
    id: "lavarse",
    title: "Lavarse las manos correctamente",
    description: "Aprende a lavarte las manos correctamente.",
    steps: [
      "Mojar las manos con agua",
      "Aplicar jabón en las palmas",
      "Frotar todas las partes durante 20 segundos",
      "Enjuagar con agua limpia",
      "Secar con una toalla o al aire"
    ],
    explain: [
      "El agua remueve la suciedad inicial.",
      "El jabón atrapa los gérmenes.",
      "Frotar elimina bacterias.",
      "Enjuagar limpia los residuos.",
      "Secar evita recontaminación."
    ]
  },
  {
    id: "sandwich",
    title: "Preparar un sándwich",
    description: "Aprende a preparar un sándwich paso a paso.",
    steps: [
      "Lavar las manos antes de cocinar",
      "Colocar dos rebanadas de pan",
      "Agregar el relleno elegido",
      "Tapar con la otra rebanada",
      "Servir y limpiar la mesa"
    ],
    explain: [
      "Evita contaminación.",
      "Organiza ingredientes.",
      "Desarrolla coordinación fina.",
      "Completa la tarea visualmente.",
      "Refuerza responsabilidad."
    ]
  },
  {
    id: "hervir",
    title: "Hervir agua con seguridad",
    description: "Aprende cómo hervir agua con cuidado.",
    steps: [
      "Llenar una olla con agua",
      "Colocar la olla sobre la estufa",
      "Encender la estufa con cuidado",
      "Esperar hasta que hierva",
      "Apagar la estufa y retirar la olla"
    ],
    explain: [
      "Medir evita derrames.",
      "Colocar correctamente previene accidentes.",
      "Encender con cuidado enseña seguridad.",
      "El hervor muestra cambio de estado.",
      "Apagar previene quemaduras."
    ]
  },
  {
    id: "germinacion",
    title: "Germinación de una semilla",
    description: "Aprende cómo una semilla crece.",
    steps: [
      "Llenar una maceta con tierra suelta",
      "Colocar la semilla a la profundidad adecuada",
      "Regar ligeramente la tierra",
      "Poner la maceta en un lugar con luz indirecta",
      "Observar su crecimiento"
    ],
    explain: [
      "La tierra sostiene la semilla.",
      "Enterrarla la protege.",
      "El agua activa la germinación.",
      "La luz suave ayuda al crecimiento.",
      "Observar enseña paciencia."
    ]
  },
  {
    id: "vestirse",
    title: "Vestirse en la mañana",
    description: "Aprende la rutina básica para vestirse.",
    steps: [
      "Elegir la ropa del día",
      "Ponerse la camiseta",
      "Ponerse el pantalón",
      "Colocarse los calcetines y zapatos",
      "Guardar la ropa que no se usa"
    ],
    explain: [
      "Elegir ayuda autonomía.",
      "Vestirse desarrolla motricidad.",
      "Aprende orden en las acciones.",
      "Finaliza la presentación personal.",
      "Refuerza responsabilidad."
    ]
  },
  {
    id: "mesa",
    title: "Poner la mesa",
    description: "Organiza la mesa antes de comer.",
    steps: [
      "Colocar el mantel o individuales",
      "Poner los platos en su lugar",
      "Ubicar cubiertos a cada lado",
      "Colocar vasos arriba del plato",
      "Servir servilletas"
    ],
    explain: [
      "Mantel protege la mesa.",
      "Platos organizan el espacio.",
      "Cubiertos enseñan lateralidad.",
      "Vasos completan la disposición.",
      "Servilletas fomentan limpieza."
    ]
  },
  {
    id: "cama",
    title: "Tender la cama",
    description: "Aprende a ordenar tu cama cada mañana.",
    steps: [
      "Retirar las sábanas arrugadas",
      "Estirar la sábana inferior",
      "Colocar la sábana superior",
      "Acomodar la cobija y almohadas",
      "Revisar que quede ordenada"
    ],
    explain: [
      "Inicia la rutina diaria.",
      "Mantiene higiene.",
      "Promueve el orden.",
      "Fomenta responsabilidad.",
      "Genera sensación de logro."
    ]
  },
  {
    id: "desayuno",
    title: "Preparar el desayuno",
    description: "Aprende una rutina básica de la mañana.",
    steps: [
      "Lavar las manos",
      "Servir cereal en un plato o vaso",
      "Agregar leche o bebida vegetal",
      "Tomar una fruta o pan",
      "Comer y limpiar la mesa"
    ],
    explain: [
      "Empieza con higiene.",
      "Prepara el alimento principal.",
      "Completa el desayuno nutritivo.",
      "Incluye alimentos frescos.",
      "Mantiene orden y hábitos."
    ]
  },
  {
    id: "mascota",
    title: "Dar de comer a una mascota",
    description: "Aprende responsabilidad cuidando un animal.",
    steps: [
      "Lavar el plato de comida",
      "Servir la porción adecuada",
      "Colocar el plato en su lugar",
      "Esperar a que coma tranquilo",
      "Guardar el alimento sobrante"
    ],
    explain: [
      "Higiene ante todo.",
      "Medir enseña cuidado.",
      "Lugar fijo da seguridad.",
      "Observar enseña empatía.",
      "Guardar promueve orden."
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
  const [order] = useState(() => shuffle(PROCESSES).slice(0, 10)); // 10 aleatorios
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showExplain, setShowExplain] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const startRef = useRef(null);
  const successRef = useRef(false);

  const process = order[index];
  const correctSequence = process.steps;

  useEffect(() => {
    resetProcess();
  }, [index]);

  function resetProcess() {
    const shuffled = shuffle(process.steps).map((text, i) => ({
      id: i,
      text
    }));
    setItems(shuffled);
    setSelected([]);
    setFeedback("");
    setShowExplain(false);
    setAttempts(0);
    setHints(0);
    successRef.current = false;
    startRef.current = Date.now();
  }

  function pick(it) {
    if (successRef.current) return;
    if (selected.find((s) => s.id === it.id)) return;
    setSelected([...selected, it]);
  }

  function removeStep(pos) {
    if (successRef.current) return;
    setSelected(selected.filter((_, i) => i !== pos));
  }

  function validate() {
    if (selected.length < correctSequence.length) {
      setFeedback("Selecciona todos los pasos.");
      return;
    }
    setAttempts((a) => a + 1);
    const ok = selected.every((s, i) => s.text === correctSequence[i]);
    const timeSpentMs = Date.now() - startRef.current;
    if (ok) {
      setFeedback("¡Excelente! Todo está en orden.");
      successRef.current = true;
      setShowExplain(true);
      onResult?.({
        processId: process.id,
        difficulty: dificultad,
        attempts: attempts + 1,
        hints,
        timeSpentMs,
        success: true
      });
      setTimeout(() => {
        if (index + 1 < order.length) {
          setIndex(index + 1);
        } else {
          setFeedback("🎉 ¡Completaste los 10 desafíos!");
        }
      }, 2500);
    } else {
      setFeedback("Algunos pasos no están en orden.");
      onResult?.({
        processId: process.id,
        difficulty: dificultad,
        attempts: attempts + 1,
        hints,
        timeSpentMs,
        success: false
      });
    }
  }

  function hint() {
    if (successRef.current) return;
    const nextText = correctSequence[selected.length];
    const item = items.find((i) => i.text === nextText);
    if (item) {
      setSelected([...selected, item]);
      setHints((h) => h + 1);
      setFeedback("Se añadió un paso correcto como pista.");
    }
  }

  return (
    <div className="paso-container">
      <h2>
        Desafío {index + 1} de {order.length}: {process.title}
      </h2>
      <p>{process.description}</p>

      <div className="paso-grid">
  <div className="paso-col">
    <h3>Pasos disponibles</h3>
    <div className="chips">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => pick(it)}
          disabled={
            selected.find((s) => s.id === it.id) || successRef.current
          }
          className={`chip ${
            selected.find((s) => s.id === it.id) ? "chip-used" : ""
          }`}
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
            {i + 1}. {it.text}
            {!successRef.current && (
              <button onClick={() => removeStep(i)}>✖</button>
            )}
          </div>
        </li>
      ))}
    </ol>
  </div>
</div>

{/* ✅ Botones movidos fuera de la caja “Tu orden” */}
<div className="acciones-globales" style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
  <button onClick={validate}>Validar</button>
  <button onClick={hint}>Pista</button>
  <button onClick={resetProcess}>Reiniciar</button>
</div>

<p className="feedback">{feedback}</p>



      {showExplain && (
        <div className="explain-box">
          <h3>Explicación</h3>
          <ol>
            {process.steps.map((s, i) => (
              <li key={i}>
                <strong>{s}:</strong> {process.explain[i]}
              </li>
            ))}
          </ol>
        </div>
      )}

      {volver && (
        <button className="volver-btn" onClick={volver}>
          ← Volver
        </button>
      )}
    </div>
  );
}

