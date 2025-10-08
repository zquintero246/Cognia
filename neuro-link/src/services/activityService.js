import actividades from "../data/actividades.json";

export const getActividadesPorModulo = (modulo) => {
  return actividades[modulo] || [];
};
