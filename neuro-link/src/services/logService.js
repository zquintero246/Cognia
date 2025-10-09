export async function registrarResultado({ user_id, module, activity_name, success, difficulty }) {
  try {
    const res = await fetch("http://localhost:3001/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, module, activity_name, success, difficulty }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error registrando resultado:", err);
  }
}
