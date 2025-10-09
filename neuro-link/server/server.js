const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const routes = require("./routes");
const activityRoutes = require("./routes/activities"); // 👈 nuevo
require("./database/init"); // Inicializa la DB

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas existentes
app.use("/api/users", userRoutes);
app.use("/api", routes);

// Nueva ruta para las actividades
app.use("/api/activities", activityRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("✅ Servidor backend activo en puerto 3001");
});
