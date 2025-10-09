// src/services/activityService.js

import Tecnico from "../modules/Tecnico/Tecnico";

/**
 * 🔹 Base de datos local de actividades por módulo
 * (sustituye completamente al archivo actividades.json)
 */
const actividadesData = {
  Cognitivo: [
    {
          name: "Memoria de colores",
          description: "Reconocimiento de colores y su secuencia.",
          stimulus: "visual",
          difficulty: 1,
          feedback: "¡Muy bien!",
          why_useful: "Ayuda a fortalecer la memoria visual y la atención sostenida. Los niños con autismo tienden a aprender mejor mediante la repetición de patrones visuales estructurados.",
          overstimulation_risk: "Bajo. Evitar colores muy brillantes o cambios de luz rápidos para no generar fatiga visual."
        },
        {
          name: "Flechas Ritmo",
          description: "Varias flechas apareceran de manera consecutiva, No dejes pasar ninguna y aumenta tu puntaje.",
          stimulus: "auditivo",
          difficulty: 2,
          feedback: "¡Excelente!",
          why_useful: "Mejora la comprensión auditiva, la asociación verbal y la orientación espacial. Refuerza la capacidad de escuchar, procesar y ejecutar instrucciones simples.",
          overstimulation_risk: "Bajo. Controlar el volumen y evitar repeticiones excesivas del mismo sonido para no causar irritación auditiva."
        },
        {
          name: "Dibujar la figura",
          description: "El usuario deberá dibujar una figura que es mencionada en un texto.",
          stimulus: "visual",
          difficulty: 3,
          feedback: "¡Perfecto!",
          why_useful: "Fortalece la comprensión lectora y la coordinación visomotora. También estimula la interpretación simbólica, un área que puede estar limitada en el espectro autista.",
          overstimulation_risk: "Bajo. Mantener el entorno visual despejado y el tiempo controlado para evitar frustración."
        }
      ],

  Social: [
    {
      name: "Construye la respuesta",
      description:
        "El usuario arma una respuesta social adecuada tocando las palabras en orden.",
      why_useful:
        "Desarrolla el lenguaje expresivo y la estructura de la conversación.",
      difficulty: "3",
      stimulus: "visual",
    },
    {
      name: "Voz y emoción",
      description:
        "Escucha una frase con una emoción y selecciona cuál es la emoción expresada.",
      why_useful:
        "Entrena la interpretación del tono de voz y la empatía auditiva.",
      difficulty: "2",
      stimulus: "auditivo",
    },
    {
        name: "Empatía en acción",
        description: "Se presenta una situación y el usuario elige la acción empática más apropiada.",
        why_useful: "Fortalece la empatía cognitiva y enseña respuestas prosociales.",
        difficulty: "3",
        stimulus: "cognitivo",
    },
  ],

  Sensorial: [
    {
      name: "Caza de Luz",
      description:
        "Haz clic en las luces que aparecen antes de que desaparezcan. Comienza despacio y observa cómo el ritmo aumenta poco a poco.",
      why_useful:
        "Mejora la coordinación visual, la atención y los reflejos, promoviendo el enfoque sensorial.",
      difficulty: "1",
      stimulus: "visual",
    },
    {
      name: "Pulso Musical",
      description:
        "Presiona al ritmo del sonido o la luz para sincronizarte con los estímulos.",
      why_useful:
        "Entrena la coordinación auditivo-motora y la sincronización rítmica.",
      difficulty: "2",
      stimulus: "auditivo",
    },
    {
      name: "Reacción Sensorial",
      description:
        "Presiona el botón tan pronto veas el círculo cambiar de color.",
      why_useful:
        "Fortalece la velocidad de respuesta y la atención sostenida ante estímulos visuales.",
      difficulty: "2",
      stimulus: "visual",
    },
  ],
  Tecnico: [
    {
      "name": "Paso a paso: la ciencia de la vida diaria",
      "description": "Organiza los pasos de tareas comunes en orden lógico.",
      "stimulus": "cognitivo",
      "difficulty": 2,
      "why_useful": "Refuerza el pensamiento secuencial y la lógica cotidiana."
    },
    {
      "name": "Explora el porqué",
      "description": "Responde preguntas sobre cómo funciona el mundo.",
      "stimulus": "cognitivo",
      "difficulty": 2,
      "why_useful": "Fomenta la curiosidad y el pensamiento científico."
    },
    {
      "name": "Clasifica por su función",
      "description": "Asocia objetos con su función correspondiente.",
      "stimulus": "visual",
      "difficulty": 3,
      "why_useful": "Refuerza la comprensión funcional de los objetos cotidianos."
    }
  ]   
};

/**
 * 🔹 Devuelve todas las actividades de un módulo
 */
export function getActividadesPorModulo(moduleName) {
  return actividadesData[moduleName] || [];
}

/**
 * 🔹 Devuelve una actividad específica por nombre dentro de un módulo
 */
export function getActividadPorNombre(moduleName, activityName) {
  const actividades = getActividadesPorModulo(moduleName);
  return actividades.find((a) => a.name === activityName);
}

/**
 * 🔹 Envía los resultados o progreso de una actividad al backend
 * Si el backend no responde, guarda localmente.
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
    console.warn(
      "⚠️ No se pudo enviar al backend, guardando localmente...",
      err
    );
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    logs.push({ ...data, ts: Date.now() });
    localStorage.setItem("activityLogs", JSON.stringify(logs));

    // Retorno simulado para mantener flujo
    return { next_module: "Sensorial", difficulty: 1, localSave: true };
  }
};
