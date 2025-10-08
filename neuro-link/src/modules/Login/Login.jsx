import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usuario === "admin" && password === "1234") {
      onLogin();
    } else {
      setError("❌ Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">✨ Bienvenido a CognIA</h1>
        <p className="login-subtitle">
          Mejora tus habilidades cognitivas y sociales
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        <p className="login-footer">
          © 2025 CognIA | Desarrollando habilidades con empatía 💜
        </p>
      </div>
    </div>
  );
}
