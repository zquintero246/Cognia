const express = require('express');
const router = express.Router();

// Ruta de salud del servidor
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para analizar actividades
router.post('/analyze', (req, res) => {
  console.log('📊 Datos recibidos para análisis:', req.body);
  
  // Aquí puedes agregar lógica de análisis
  res.json({ 
    message: 'Análisis completado',
    next_module: 'Sensorial',
    difficulty: 2,
    recommendations: ['Continúa con ejercicios similares']
  });
});

module.exports = router;