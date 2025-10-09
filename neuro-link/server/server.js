const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const routes = require('./routes');
require('./database/init'); // Inicializa la DB

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas existentes
app.use('/api/users', userRoutes);

// Nuevas rutas integradas
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('✅ Servidor backend activo en puerto 3001');
});