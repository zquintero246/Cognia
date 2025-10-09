// src/services/logService.js
export async function registrarResultado(data) {
  try {
    // Se usa el endpoint correcto del backend
    const res = await fetch("http://localhost:3001/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log("📘 Resultado registrado:", result);
    return result;
  } catch (err) {
    console.error("❌ Error al registrar resultado:", err);
  }
}



