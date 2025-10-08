import { useState, useRef } from "react";
import { activitySchema } from "../../data/activitySchema";
import { sendActivity } from "../../services/activityService";
import { analyzeActivity } from "../../services/aiService";

/**
 * Hook reusable para medir y registrar las métricas de actividades sensoriales.
 * @param {Object} config - Configuración inicial del hook.
 * @param {string} config.userId - ID del usuario actual.
 * @param {string} config.moduleName - Nombre del módulo ("Sensorial", etc.)
 * @param {string} config.activityId - Identificador único de la actividad.
 * @param {Function} config.onRecommendation - Callback que se ejecuta con la respuesta IA.
 */
export default function useSensorialLogic({
  userId = "anon",
  moduleName = "Sensorial",
  activityId = "default_activity",
  onRecommendation = () => {},
}) {
  // Estados de rendimiento
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [focusLoss, setFocusLoss] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Tiempo de inicio
  const startRef = useRef(null);

  // ⏱ Inicia el temporizador
  function startTimer() {
    startRef.current = Date.now();
  }

  // 🧩 Registra acciones
  function incrementCorrect() {
    setCorrect((c) => c + 1);
    setAttempts((a) => a + 1);
  }

  function incrementError() {
    setErrors((e) => e + 1);
    setAttempts((a) => a + 1);
  }

  function addFocusLoss() {
    setFocusLoss((f) => f + 1);
  }

  function useHint() {
    setHintsUsed((h) => h + 1);
  }

  // 🚀 Finaliza el juego, guarda resultados y llama IA
  async function finish() {
    const end = Date.now();
    const time = (end - (startRef.current || end)) / 1000;

    const payload = {
      ...activitySchema,
      user_id: userId,
      module: moduleName,
      activity_id: activityId,
      correct,
      errors,
      attempts,
      focus_loss: focusLoss,
      hints_used: hintsUsed,
      time,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Enviando actividad:", payload);

    try {
      await sendActivity(payload);
      const recommendation = await analyzeActivity(payload);
      console.log("🤖 Recomendación IA:", recommendation);
      onRecommendation(recommendation);
      return { payload, recommendation };
    } catch (err) {
      console.error("Error al enviar datos:", err);
      return null;
    }
  }

  // Retorna todo lo necesario
  return {
    startTimer,
    incrementCorrect,
    incrementError,
    addFocusLoss,
    useHint,
    finish,
    state: { correct, errors, attempts, focusLoss, hintsUsed },
  };
}
