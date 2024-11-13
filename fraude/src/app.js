// Importar el controlador de fraude
const { verificarFraude } = require('./controllers/fraudeController');

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para analizar JSON (opcional, si necesitas manejar POST requests con datos en JSON en el futuro)
app.use(express.json());

// Endpoint GET para verificar fraude de un usuario específico
app.get('/api/v1/validate/:user_id', verificarFraude);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Microservicio de ventas y detección de fraude en el puerto ${PORT}`);
});
