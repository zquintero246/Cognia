import React, { useState, useEffect } from "react";
import "./ClasificaFuncion.css";

const PAREJAS = [
  {
    objeto: "Tijeras",
    funcion: "Cortar papel o tela",
    explicacion:
      "Las tijeras tienen hojas afiladas que permiten cortar materiales delgados."
  },
  {
    objeto: "Cepillo de dientes",
    funcion: "Limpiar los dientes",
    explicacion:
      "El cepillo sirve para eliminar restos de comida y placa bacteriana."
  },
  {
    objeto: "Linterna",
    funcion: "Iluminar en la oscuridad",
    explicacion:
      "La linterna usa energía para emitir luz y ayudarnos a ver sin luz natural."
  },
  {
    objeto: "Reloj",
    funcion: "Medir el tiempo",
    explicacion:
      "El reloj nos muestra las horas y minutos para organizar nuestras actividades."
  },
  {
    objeto: "Termómetro",
    funcion: "Medir la temperatura",
    explicacion:
      "El termómetro detecta el calor o el frío para saber si hay fiebre o medir el clima."
  }
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ClasificaFuncion({ volver }) {
  const [objetos, setObjetos] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [seleccion, setSeleccion] = useState({ objeto: null, funcion: null });
  const [aciertos, setAciertos] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [explicacion, setExplicacion] = useState("");

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setObjetos(shuffle(PAREJAS.map((p) => p.objeto)));
    setFunciones(shuffle(PAREJAS.map((p) => p.funcion)));
    setAciertos([]);
    setSeleccion({ objeto: null, funcion: null });
    setFeedback("");
    setExplicacion("");
  };

  const handleSelect = (type, value) => {
    setSeleccion((prev) => ({ ...prev, [type]: value }));

    // Si ya hay ambos seleccionados
    if (type === "funcion" && seleccion.objeto) {
      verificar(seleccion.objeto, value);
    } else if (type === "objeto" && seleccion.funcion) {
      verificar(value, seleccion.funcion);
    }
  };

  const verificar = (objeto, funcion) => {
    const parejaCorrecta = PAREJAS.find(
      (p) => p.objeto === objeto && p.funcion === funcion
    );
    if (parejaCorrecta) {
      setAciertos([...aciertos, objeto]);
      setFeedback("✅ ¡Correcto! Buena asociación.");
      setExplicacion(parejaCorrecta.explicacion);
      const voice = new SpeechSynthesisUtterance("¡Muy bien! Respuesta correcta.");
      voice.lang = "es-ES";
      window.speechSynthesis.speak(voice);
    } else {
      setFeedback("❌ No es correcto, intenta de nuevo.");
      setExplicacion("");
    }
    setSeleccion({ objeto: null, funcion: null });
  };

  return (
    <div className="clasifica-container">
      <h2>🧩 Clasifica la Función</h2>
      <p className="clasifica-instruccion">
        Relaciona cada objeto con su función correcta.
      </p>

      <div className="clasifica-grid">
        <div className="clasifica-col">
          <h3>Objetos</h3>
          <ul>
            {objetos.map((obj) => (
              <li key={obj}>
                <button
                  className={`clasifica-btn ${
                    seleccion.objeto === obj ? "seleccionado" : ""
                  } ${aciertos.includes(obj) ? "correcto" : ""}`}
                  onClick={() => handleSelect("objeto", obj)}
                  disabled={aciertos.includes(obj)}
                >
                  {obj}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="clasifica-col">
          <h3>Funciones</h3>
          <ul>
            {funciones.map((f) => (
              <li key={f}>
                <button
                  className={`clasifica-btn ${
                    seleccion.funcion === f ? "seleccionado" : ""
                  }`}
                  onClick={() => handleSelect("funcion", f)}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="clasifica-feedback">{feedback}</p>

      {explicacion && (
        <div className="clasifica-explicacion">
          <strong>💡 ¿Sabías que...? </strong>
          <p>{explicacion}</p>
        </div>
      )}

      <div className="clasifica-bottom">
        <button onClick={resetGame}>🔄 Reiniciar</button>
        {volver && (
          <button className="volver-btn" onClick={volver}>
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}
