const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
require('./database/init'); // Inicializa la DB

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});