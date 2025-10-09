import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext"; // ★ AGREGAR AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ★ AuthProvider AFUERA */}
      <UserProvider> {/* ★ UserProvider ADENTRO */}
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
