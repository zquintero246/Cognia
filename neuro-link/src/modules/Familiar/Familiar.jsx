import React from "react";
import "../../styles/Familiar.css"; // 🔥 Importa el nuevo CSS correcto

export default function Familiar() {
  return (
    <div className="familiar-container">
      <h1 className="familiar-title">Módulo Familiar</h1>
      <p className="familiar-descripcion">
        En este módulo aprenderás a fortalecer los vínculos familiares a través del respeto, la empatía y la comunicación asertiva.
      </p>

      <div className="familiar-botones">
        <button className="familiar-boton" onClick={() => alert("Ejercicio: Resolviendo Conflictos")}>
          Resolviendo Conflictos
        </button>
        <button className="familiar-boton" onClick={() => alert("Ejercicio: Apoyo Mutuo")}>
          Apoyo Mutuo
        </button>
      </div>
    </div>
  );
}
