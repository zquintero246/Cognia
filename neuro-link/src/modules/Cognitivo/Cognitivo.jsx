import { getActividadesPorModulo } from "../../services/activityService";

export default function Cognitivo() {
  const actividades = getActividadesPorModulo("cognitivo");

  return (
    <div>
      <h1>Módulo Cognitivo</h1>
      <ul>
        {actividades.map((a) => (
          <li key={a.id}>{a.nombre} – {a.objetivo}</li>
        ))}
      </ul>
    </div>
  );
}
