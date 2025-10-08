import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🧠 Panel Principal</h1>
      <p className="dashboard-subtitle">
        Selecciona un módulo para comenzar
      </p>

      <div className="dashboard-grid">
        <div
          className="dashboard-card cognitivo"
          onClick={() => navigate("/cognitivo")}
        >
          <h3>Cognitivo</h3>
          <p>Desarrolla tus habilidades mentales</p>
        </div>

        <div
          className="dashboard-card sensorial"
          onClick={() => navigate("/sensorial")}
        >
          <h3>Sensorial</h3>
          <p>Explora tus sentidos y reacciones</p>
        </div>

        <div
          className="dashboard-card social"
          onClick={() => navigate("/social")}
        >
          <h3>Social</h3>
          <p>Practica empatía y comunicación</p>
        </div>

        <div
          className="dashboard-card familiar"
          onClick={() => navigate("/familiar")}
        >
          <h3>Familiar</h3>
          <p>Fortalece vínculos familiares</p>
        </div>

        <div
          className="dashboard-card tecnico"
          onClick={() => navigate("/tecnico")}
        >
          <h3>Técnico</h3>
          <p>Aprende y aplica conocimientos prácticos</p>
        </div>
      </div>
    </div>
  );
}
