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

