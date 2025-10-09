// src/hooks/useRegistroActividad.js
import { registrarResultado } from "../services/logService";

export function useRegistroActividad() {
  const registrarExito = async (modulo, actividad, nivel, extra = {}) => {
    const data = {
      user_id: "usuario_demo", // luego se reemplaza con user real
      module: modulo,
      activity: actividad,
      success: true,
      difficulty: nivel,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    await registrarResultado(data);
  };

  const registrarFallo = async (modulo, actividad, nivel, extra = {}) => {
    const data = {
      user_id: "usuario_demo",
      module: modulo,
      activity: actividad,
      success: false,
      difficulty: nivel,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    await registrarResultado(data);
  };

  return { registrarExito, registrarFallo };
}

