// src/modules/Cognitivo/ClasificaFuncion.jsx
import React, { useState, useEffect } from "react";
import "./ClasificaFuncion.css";
import { useRegistroActividad } from "../../hooks/useRegistroActividad";

const PAREJAS = [
  // --- Cotidianos ---
  { objeto: "Cuchara", funcion: "Comer sopa o cereal", explicacion: "La cuchara se usa para tomar alimentos líquidos o suaves." },
  { objeto: "Zapatos", funcion: "Proteger los pies al caminar", explicacion: "Los zapatos evitan que nos lastimemos los pies al andar." },
  { objeto: "Sombrero", funcion: "Proteger del sol", explicacion: "El sombrero cubre la cabeza para evitar el calor o el sol directo." },
  { objeto: "Vaso", funcion: "Beber agua o jugo", explicacion: "El vaso sirve para contener líquidos y poder beberlos fácilmente." },
  { objeto: "Tenedor", funcion: "Pinchar y comer alimentos sólidos", explicacion: "El tenedor sirve para tomar pedazos de comida y llevarlos a la boca." },
  { objeto: "Paraguas", funcion: "Protegerse de la lluvia", explicacion: "El paraguas evita que nos mojemos al llover." },
  { objeto: "Llave", funcion: "Abrir o cerrar una puerta", explicacion: "La llave encaja en la cerradura para abrir o asegurar el acceso." },
  { objeto: "Escoba", funcion: "Barrer el piso", explicacion: "La escoba sirve para limpiar el suelo y retirar el polvo o la suciedad." },
  { objeto: "Plancha", funcion: "Quitar arrugas de la ropa", explicacion: "La plancha calienta la tela para dejarla lisa y ordenada." },
  { objeto: "Refrigerador", funcion: "Conservar alimentos fríos", explicacion: "El refrigerador mantiene los alimentos frescos y evita que se dañen." },

  // --- Escuela / Oficina ---
  { objeto: "Lápiz", funcion: "Escribir o dibujar", explicacion: "El lápiz deja una marca en el papel para escribir o hacer dibujos." },
  { objeto: "Tijeras", funcion: "Cortar papel o tela", explicacion: "Las tijeras tienen hojas afiladas que permiten cortar materiales delgados." },
  { objeto: "Regla", funcion: "Medir longitudes", explicacion: "La regla sirve para medir o trazar líneas rectas con precisión." },
  { objeto: "Borrador", funcion: "Eliminar trazos de lápiz", explicacion: "El borrador quita las marcas de lápiz del papel sin dañarlo." },
  { objeto: "Mochila", funcion: "Transportar útiles escolares", explicacion: "La mochila permite llevar libros y materiales de un lugar a otro." },

  // --- Tecnología ---
  { objeto: "Teléfono", funcion: "Llamar y comunicarse con otros", explicacion: "El teléfono permite hablar o enviar mensajes a distancia." },
  { objeto: "Computador", funcion: "Realizar tareas digitales", explicacion: "El computador sirve para escribir, navegar, programar o estudiar en línea." },
  { objeto: "Televisor", funcion: "Ver programas o películas", explicacion: "El televisor muestra imágenes y sonidos de diferentes canales o plataformas." },
  { objeto: "Cámara fotográfica", funcion: "Tomar fotografías", explicacion: "La cámara capta imágenes del entorno mediante luz y enfoque." },
  { objeto: "Auriculares", funcion: "Escuchar música o sonidos en privado", explicacion: "Los auriculares transmiten sonido directamente a los oídos sin ruido externo." },

  // --- Ciencia / Hogar avanzado ---
  { objeto: "Microscopio", funcion: "Ver cosas muy pequeñas", explicacion: "El microscopio aumenta el tamaño de objetos diminutos para poder observarlos mejor." },
  { objeto: "Termómetro", funcion: "Medir la temperatura", explicacion: "El termómetro detecta el calor o el frío para saber si hay fiebre o medir el clima." },
  { objeto: "Estetoscopio", funcion: "Escuchar los latidos del corazón", explicacion: "El estetoscopio amplifica los sonidos internos del cuerpo para revisiones médicas." },
  { objeto: "Destornillador", funcion: "Ajustar o quitar tornillos", explicacion: "El destornillador encaja en la cabeza del tornillo para girarlo." },
  { objeto: "Linterna", funcion: "Iluminar en la oscuridad", explicacion: "La linterna usa energía para emitir luz y ayudarnos a ver sin luz natural." }
];

// 🔹 Mezcla aleatoria
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
  const [usadas, setUsadas] = useState([]);

  // ✅ Hook de registro de actividad
  const { registrarExito, registrarFallo } = useRegistroActividad();

  const elegirAleatorias = () => shuffle(PAREJAS).slice(0, 6);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const seleccionadas = elegirAleatorias();
    setUsadas(seleccionadas);
    setObjetos(shuffle(seleccionadas.map((p) => p.objeto)));
    setFunciones(shuffle(seleccionadas.map((p) => p.funcion)));
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
    const parejaCorrecta = usadas.find(
      (p) => p.objeto === objeto && p.funcion === funcion
    );

    if (parejaCorrecta) {
      setAciertos([...aciertos, objeto]);
      setFeedback("✅ ¡Correcto! Buena asociación.");
      setExplicacion(parejaCorrecta.explicacion);

      registrarExito("Cognitiva", "Clasifica la función", 1);

      const voice = new SpeechSynthesisUtterance("¡Muy bien! Respuesta correcta.");
      voice.lang = "es-ES";
      window.speechSynthesis.speak(voice);

      if (aciertos.length + 1 === usadas.length) {
        setTimeout(() => {
          setFeedback("🎉 ¡Completaste la ronda!");
          registrarExito("Cognitiva", "Clasifica la función", 1);
          const voiceEnd = new SpeechSynthesisUtterance("¡Excelente! Completaste todas las parejas.");
          voiceEnd.lang = "es-ES";
          window.speechSynthesis.speak(voiceEnd);
        }, 500);
      }
    } else {
      setFeedback("❌ No es correcto, intenta de nuevo.");
      registrarFallo("Cognitiva", "Clasifica la función", 1);
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
        <button onClick={resetGame}>🔄 Nueva ronda</button>
        {volver && (
          <button className="volver-btn" onClick={volver}>
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}
