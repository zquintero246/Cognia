// src/services/activityService.js
import actividadesData from "../data/actividades.json";

/**
 * 🔹 Obtiene todas las actividades de un módulo desde el JSON o las define estáticamente si no existen.
 */
export function getActividadesPorModulo(moduleName) {
  // Buscar módulo en el archivo JSON
  const modulo = actividadesData.modules.find(
    (m) => m.module.toLowerCase() === moduleName.toLowerCase()
  );

  // Si lo encuentra, devolver sus actividades
  if (modulo) return modulo.activities;

  // Si no está en el JSON, usar fallback estático
  const actividadesFallback = {
    Social: [
      {
        name: "Construye la respuesta",
        description: "Ordena las palabras para formar una respuesta social adecuada.",
        why_useful: "Mejora la formulación de respuestas sociales.",
        difficulty: "Fácil",
        stimulus: "Visual/Textual",
      },
      {
        name: "Empatía en acción",
        description: "Identifica emociones en situaciones cotidianas.",
        why_useful: "Entrena reconocimiento emocional y empatía.",
        difficulty: "Fácil",
        stimulus: "Lectura",
      },
      {
        name: "Voz y emoción",
        description: "Practica decir frases y expresar emoción con la voz.",
        why_useful: "Mejora la expresión verbal y entonación.",
        difficulty: "Medio",
        stimulus: "Auditivo/Verbal",
      },
    ],
    Familiar: [
      {
        name: "Conversación en Familia",
        description: "Aprende a comunicarte con empatía en tu entorno familiar.",
        why_useful: "Fortalece vínculos afectivos y fomenta el respeto.",
        difficulty: "Fácil",
        stimulus: "Verbal",
      },
      {
        name: "Resolviendo Conflictos",
        description: "Elige la mejor forma de resolver desacuerdos en familia.",
        why_useful: "Mejora la resolución pacífica de conflictos.",
        difficulty: "Medio",
        stimulus: "Reflexivo",
      },
      {
        name: "Apoyo Mutuo",
        description: "Practica el reconocimiento y la ayuda entre miembros de la familia.",
        why_useful: "Fomenta la cooperación y el sentido de equipo familiar.",
        difficulty: "Fácil",
        stimulus: "Emocional/Reflexivo",
      },
    ],
  };

  return actividadesFallback[moduleName] ?? [];
}

/**
 * 🔹 Obtiene una actividad específica por nombre dentro de un módulo.
 */
export function getActividadPorNombre(moduleName, activityName) {
  const actividades = getActividadesPorModulo(moduleName);
  return actividades.find((a) => a.name === activityName);
}

/**
 * 🔹 Envía los resultados o progreso de una actividad al backend.
 * Si el backend no está disponible, guarda en localStorage.
 */
export const sendActivity = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al comunicarse con el backend");

    const json = await res.json();
    console.log("✅ Actividad enviada correctamente:", json);
    return json;
  } catch (err) {
    console.warn("⚠️ No se pudo enviar al backend, guardando localmente...", err);
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    logs.push({ ...data, ts: Date.now() });
    localStorage.setItem("activityLogs", JSON.stringify(logs));

    // Retornar una respuesta simulada para mantener flujo
    return { next_module: "Sensorial", difficulty: 1, localSave: true };
  }
};

