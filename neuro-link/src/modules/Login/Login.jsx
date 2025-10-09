import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import arriba from "./assets/arriba.svg";
import abajo from "./assets/abajo.svg";
import nino from "./assets/nino.svg";
import fundacion from "./assets/fundacion.svg";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth(); // ★ LLAMADA DIRECTA, SIN CONDICIONALES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users");
      const users = await response.json();

      const userFound = users.find(
        (user) => user.username === username && user.password === password
      );

      if (userFound) {
        login(userFound);
        navigate("/dashboard");
      } else {
        setError("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("❌ Error de conexión. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockSelection = (e) => {
      // permitir selección solo dentro de inputs o botones
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "BUTTON"
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelection);
    document.addEventListener("dragstart", blockSelection);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("selectstart", blockSelection);
      document.removeEventListener("dragstart", blockSelection);
    };
  }, []);

  return (
    <div className="login">
      {/* decoraciones SVG */}
      <img src={arriba} alt="decoración superior" className="decor decor-top" />
      <img src={abajo} alt="decoración inferior" className="decor decor-bottom" />

      {/* grid principal */}
      <div className="login__grid">
        {/* ilustración lateral */}
        <div className="login__illustration">
          <img src={nino} alt="Ilustración niño CognIA" />
        </div>

        {/* panel de login */}
        <div className="login__panel">
          <div className="login__heading">
            <img
              src={fundacion}
              alt="Logo fundación CognIA"
              className="fundacion-title"
            />
          </div>

          <form onSubmit={handleSubmit} className="login__form">
            <div className="field">
              <label className="field__label--top" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="field__input"
              />
            </div>

            <div className="field">
              <label className="field__label--top" htmlFor="password">
                Contraseña
              </label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="field__input"
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button">
              Ingresar
            </button>

            <button type="button" className="link-forgot">
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
