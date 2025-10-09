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
          name: "Seguir dirección",
          description: "Sigue la direccion de las flechas con instrucciones!",
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
      name: "Historias de Dos Corazones",
      description: "Cada jugador tiene su turno para representar o describir una emoción sin decir su nombre directamente.",
      why_useful: "Fortalece la empatía cognitiva y enseña respuestas prosociales.",
      difficulty: "3",
      stimulus: "Cognitivo",
    },
    {
      name: "Reflejo Social",
      description: "Fortalecer la imitación, sincronía social y empatía corporal, Uno de los jugadores realiza un movimiento, y el otro debe imitarlo lo más rápido y preciso posible.",
      stimulus: "Auditivo",
      difficulty: 3,
      why_useful: "Estimula atención compartida.",
    },
    {
      name: "Te entiendo (cooperativo)",
      description: "Dos niños juegan juntos: uno identifica la emoción del personaje y el otro elige una acción empática.",
      stimulus: "social",
      difficulty: 3,
      why_useful: "Refuerza empatía cognitiva y respuestas prosociales mediante cooperación entre pares."
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
      name: "Eco Armónico",
      description:
        "El jugador escucha una secuencia de sonidos naturales (por ejemplo: pájaro, tambor, viento, gota de agua) y debe repetirlos en el mismo orden tocando los íconos correspondientes.",
      why_useful:
        "Mejora atención sostenida y asociación multisensorial.",
      difficulty: "2",
      stimulus: "Auditivo + Visual.",
    },
  ],

  Tecnico: [
    {
      "name": "Mini programador",
      "description": "Ayuda a un pequeño robot a llegar a su objetivo organizando los pasos correctos. Arrastra flechas (→ ↓ ↑ ←) en el orden adecuado.",
      "stimulus": "cognitivo",
      "difficulty": 2,
      "why_useful": "Introduce el pensamiento secuencial y lógico, base del pensamiento computacional."
    },
    {
      "name": "Construye tu robot",
      "description": "Combina piezas como cabeza, cuerpo, brazos y luces para armar tu propio robot y ver cómo cobra vida.",
      "stimulus": "sensorial",
      "difficulty": 1,
      "why_useful": "Fomenta la creatividad técnica y el reconocimiento de componentes, acercando a los niños al mundo de la robótica."
    },
     {
      "name": "Encuentra el error",
      "description": "Observa una secuencia o máquina con un paso incorrecto y descubre qué parte está mal para que todo funcione bien.",
      "stimulus": "cognitivo",
      "difficulty": 3,
      "why_useful": "Fortalece el razonamiento lógico y la observación técnica al identificar fallos en procesos o sistemas."
     }
  ],

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
