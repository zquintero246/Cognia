// src/services/logService.js
export async function registrarResultado(data) {
  try {
    const res = await fetch("http://localhost:3001/api/activities/registrar_resultado", {
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


