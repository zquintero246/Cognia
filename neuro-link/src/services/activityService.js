import actividadesData from "../data/actividades.json";

export function getActividadesPorModulo(moduleName) {
  const modulo = actividadesData.modules.find(
    (m) => m.module.toLowerCase() === moduleName.toLowerCase()
  );
  return modulo ? modulo.activities : [];
}

export function getActividadPorNombre(moduleName, activityName) {
  const modulo = getActividadesPorModulo(moduleName);
  return modulo.find((a) => a.name === activityName);
}


export const sendActivity = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No backend");
    return await res.json();
  } catch (err) {
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    logs.push({ ...data, ts: Date.now() });
    localStorage.setItem("activityLogs", JSON.stringify(logs));
    return { next_module: "Sensorial", difficulty: 1 };
  }
};


