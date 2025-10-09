const express = require("express");
const router = express.Router();
const activity = require("./activityController");

router.post("/log-activity", activity.logActivity);
router.get("/user-logs/:user_id", activity.getUserLogs);

module.exports = router;
