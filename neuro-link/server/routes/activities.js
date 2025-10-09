// routes/activities.js
const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Registrar un resultado de actividad (éxito o fallo)
router.post("/registrar_resultado", async (req, res) => {
  try {
    const { user_id, module, activity, success, difficulty, timestamp } = req.body;

    if (!user_id || !module || !activity || difficulty === undefined) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Inserta el resultado en la base de datos
    await db.run(
      `INSERT INTO activity_logs (user_id, module, activity, success, difficulty, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, module, activity, success ? 1 : 0, difficulty, timestamp]
    );

    res.json({ message: "✅ Resultado registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar resultado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener historial de un usuario
router.get("/historial/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const results = await db.all(
      "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC",
      [user_id]
    );
    res.json(results);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

module.exports = router;
