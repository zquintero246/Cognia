import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // ★ CAMBIADO de usuario a username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // CONSULTAR USUARIOS DESDE LA BASE DE DATOS
      const response = await fetch('http://localhost:3001/api/users');
      const users = await response.json();

      // ★ BUSCAR USUARIO QUE COINCIDA CON USERNAME Y CONTRASEÑA
      const userFound = users.find(user => 
        user.username === username && user.password === password
      );

      if (userFound) {
        navigate("/Dashboard");
      } else {
        setError("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError("❌ Error de conexión. Intenta nuevamente.");
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
            placeholder="Username" // ★ CAMBIADO placeholder
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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