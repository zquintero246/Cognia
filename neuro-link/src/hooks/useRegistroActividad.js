import { registrarResultado } from "../services/logService";
import { useUser } from "../context/UserContext";

export function useRegistroActividad() {
  const { user } = useUser();

  const registrarExito = async (modulo, nombre, dificultad) => {
    await registrarResultado({
      user_id: user.id || 1, // por ahora usa 1 si no hay sesión activa
      module: modulo,
      activity_name: nombre,
      success: true,
      dificultad,
    });
  };

  const registrarFallo = async (modulo, nombre, dificultad) => {
    await registrarResultado({
      user_id: user.id || 1,
      module: modulo,
      activity_name: nombre,
      success: false,
      dificultad,
    });
  };

  return { registrarExito, registrarFallo };
}
