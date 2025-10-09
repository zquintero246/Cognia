// src/hooks/useRegistroActividad.js
import { registrarResultado } from "../services/logService";

export function useRegistroActividad() {
  const registrarExito = async (modulo, actividad, nivel) => {
    const data = {
      user_id: "usuario_demo", // luego se reemplaza con el user real
      module: modulo,
      activity_name: actividad, // ✅ nombre correcto
      success: true,
      difficulty: nivel,
      timestamp: new Date().toISOString(),
      
    };
    await registrarResultado(data);
  };

  const registrarFallo = async (modulo, actividad, nivel) => {
    const data = {
      user_id: "usuario_demo",
      module: modulo,
      activity_name: actividad, // ✅ nombre correcto
      success: false,
      difficulty: nivel,
      timestamp: new Date().toISOString(),
      
    };
    await registrarResultado(data);
  };

  return { registrarExito, registrarFallo };
}

