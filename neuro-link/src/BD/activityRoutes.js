const express = require("express");
const router = express.Router();
const activity = require("./activityController");

// Registrar actividad (éxito o fallo)
router.post("/log-activity", activity.logActivity);

// Obtener logs de un usuario
router.get("/user-logs/:user_id", activity.getUserLogs);

module.exports = router;
