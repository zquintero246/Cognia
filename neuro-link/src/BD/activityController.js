const db = require("./init");

module.exports = {
  logActivity: (req, res) => {
    const { user_id, module, activity_name, success, difficulty } = req.body;

    db.run(
      `INSERT INTO activity_logs (user_id, module, activity_name, success, difficulty) VALUES (?, ?, ?, ?, ?)`,
      [user_id, module, activity_name, success ? 1 : 0, difficulty],
      function (err) {
        if (err) {
          console.error(err);
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
          console.error(err);
          res.status(500).json({ error: "Error al obtener logs" });
        } else {
          res.json(rows);
        }
      }
    );
  },
};
