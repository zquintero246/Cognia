// difficultyService.js
// Sistema simulado de ajuste de dificultad (antes de la IA real)

const BASE_STATE = {
  cognitivo: "normal",
  sensorial: "normal",
  social: "normal",
  tecnico: "normal",
};

/**
 * Obtiene la dificultad actual del usuario desde localStorage
 */
export const getDifficulty = (moduleName) => {
  const data = JSON.parse(localStorage.getItem("userDifficulty")) || BASE_STATE;
  return data[moduleName.toLowerCase()] || "normal";
};

/**
 * Guarda el nuevo nivel de dificultad
 */
const saveDifficulty = (data) => {
  localStorage.setItem("userDifficulty", JSON.stringify(data));
};

/**
 * Ajusta la dificultad del usuario en función de su rendimiento
 * 
 * @param {string} moduleName - Nombre del módulo (tecnico, cognitivo, etc.)
 * @param {object} result - Objeto con las métricas:
 *   { success, attempts, hintsUsed, timeSpentMs }
 */
export const updateDifficulty = (moduleName, result) => {
  const currentData =
    JSON.parse(localStorage.getItem("userDifficulty")) || BASE_STATE;
  const currentLevel = currentData[moduleName.toLowerCase()] || "normal";

  let newLevel = currentLevel;
  const { success, attempts, hintsUsed, timeSpentMs } = result;

  // Lógica básica de ajuste (puedes refinarla)
  if (success && attempts === 1 && hintsUsed === 0 && timeSpentMs < 30000) {
    // Aprendió rápido y sin ayuda → subir dificultad
    if (currentLevel === "facil") newLevel = "normal";
    else if (currentLevel === "normal") newLevel = "dificil";
  } else if (!success || hintsUsed > 2 || timeSpentMs > 90000) {
    // Falló o necesitó mucha ayuda → bajar dificultad
    if (currentLevel === "dificil") newLevel = "normal";
    else if (currentLevel === "normal") newLevel = "facil";
  }

  // Guarda el nuevo nivel si cambia
  if (newLevel !== currentLevel) {
    currentData[moduleName.toLowerCase()] = newLevel;
    saveDifficulty(currentData);
    console.log(
      `📊 Dificultad de ${moduleName} ajustada: ${currentLevel} → ${newLevel}`
    );
  }

  return newLevel;
};

/**
 * Reinicia todos los niveles de dificultad del usuario
 */
export const resetDifficulty = () => {
  localStorage.setItem("userDifficulty", JSON.stringify(BASE_STATE));
  console.log("🔁 Dificultad reiniciada a nivel base.");
};
