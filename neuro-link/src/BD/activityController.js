const db = require("./init");

module.exports = {
  logActivity: (req, res) => {
    const { user_id, module, activity, success } = req.body;

    // Validación mínima de campos requeridos
    if (!user_id || !module || !activity) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    db.run(
      `INSERT INTO activity_logs (user_id, module, activity_name, success) VALUES (?, ?, ?, ?)`,
      [user_id, module, activity, success ? 1 : 0],
      function (err) {
        if (err) {
          console.error("❌ Error al registrar actividad:", err);
          res.status(500).json({ error: "Error al registrar actividad" });
        } else {
          res.json({ success: true, id: this.lastID });
        }
      }
    );
  },

  getUserLogs: (req, res) => {
    const { user_id } = req.params;

    db.all(
      `SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC`,
      [user_id],
      (err, rows) => {
        if (err) {
          console.error("❌ Error al obtener logs:", err);
          res.status(500).json({ error: "Error al obtener logs" });
        } else {
          res.json(rows);
        }
      }
    );
  },
};

