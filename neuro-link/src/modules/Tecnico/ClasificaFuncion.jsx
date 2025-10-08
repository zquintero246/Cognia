// ClasificaFuncion.jsx
import React, { useState, useEffect } from "react";
import "./ClasificaFuncion.css";

const PAREJAS = {
  facil: [
    {
      objeto: "Cuchara",
      funcion: "Comer sopa o cereal",
      explicacion: "La cuchara se usa para tomar alimentos líquidos o suaves."
    },
    {
      objeto: "Zapatos",
      funcion: "Proteger los pies al caminar",
      explicacion: "Los zapatos evitan que nos lastimemos los pies al andar."
    },
    {
      objeto: "Sombrero",
      funcion: "Proteger del sol",
      explicacion: "El sombrero cubre la cabeza para evitar el calor o el sol directo."
    },
    {
      objeto: "Lápiz",
      funcion: "Escribir o dibujar",
      explicacion: "El lápiz deja una marca en el papel para escribir o hacer dibujos."
    },
    {
      objeto: "Vaso",
      funcion: "Beber agua o jugo",
      explicacion: "El vaso sirve para contener líquidos y poder beberlos fácilmente."
    }
  ],
  normal: [
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
  ],
  dificil: [
    {
      objeto: "Microscopio",
      funcion: "Ver cosas muy pequeñas",
      explicacion:
        "El microscopio aumenta el tamaño de objetos diminutos para poder observarlos mejor."
    },
    {
      objeto: "Compás",
      funcion: "Trazar círculos o medir distancias",
      explicacion:
        "El compás tiene dos brazos que permiten hacer círculos o medir en el papel."
    },
    {
      objeto: "Destornillador",
      funcion: "Ajustar o quitar tornillos",
      explicacion:
        "El destornillador encaja en la cabeza del tornillo para girarlo."
    },
    {
      objeto: "Calculadora",
      funcion: "Realizar operaciones matemáticas",
      explicacion:
        "La calculadora nos ayuda a sumar, restar, multiplicar y dividir rápidamente."
    },
    {
      objeto: "Estetoscopio",
      funcion: "Escuchar los latidos del corazón",
      explicacion:
        "El estetoscopio amplifica los sonidos internos del cuerpo para revisiones médicas."
    }
  ]
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ClasificaFuncion({ volver, dificultad = "normal" }) {
  const [objetos, setObjetos] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [seleccion, setSeleccion] = useState({ objeto: null, funcion: null });
  const [aciertos, setAciertos] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [explicacion, setExplicacion] = useState("");

  const data = PAREJAS[dificultad] || PAREJAS.normal;

  useEffect(() => {
    resetGame();
  }, [dificultad]);

  const resetGame = () => {
    setObjetos(shuffle(data.map((p) => p.objeto)));
    setFunciones(shuffle(data.map((p) => p.funcion)));
    setAciertos([]);
    setSeleccion({ objeto: null, funcion: null });
    setFeedback("");
    setExplicacion("");
  };

  const handleSelect = (type, value) => {
    setSeleccion((prev) => ({ ...prev, [type]: value }));

    if (type === "funcion" && seleccion.objeto) {
      verificar(seleccion.objeto, value);
    } else if (type === "objeto" && seleccion.funcion) {
      verificar(value, seleccion.funcion);
    }
  };

  const verificar = (objeto, funcion) => {
    const parejaCorrecta = data.find(
      (p) => p.objeto === objeto && p.funcion === funcion
    );
    if (parejaCorrecta) {
      setAciertos([...aciertos, objeto]);
      setFeedback("✅ ¡Correcto! Buena asociación.");
      setExplicacion(parejaCorrecta.explicacion);

      const voice = new SpeechSynthesisUtterance(
        "¡Muy bien! Respuesta correcta."
      );
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

