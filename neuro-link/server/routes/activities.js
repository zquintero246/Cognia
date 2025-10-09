const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Registrar resultado de actividad
router.post("/registrar_resultado", async (req, res) => {
  try {
    const { user_id, module, activity, success, difficulty, timestamp } = req.body;

    if (!user_id || !module || !activity || difficulty === undefined) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Ejecutar inserción como promesa
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO activity_logs (user_id, module, activity_name, success, difficulty, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, module, activity, success ? 1 : 0, difficulty, timestamp],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

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

    const results = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC",
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(results);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

module.exports = router;
