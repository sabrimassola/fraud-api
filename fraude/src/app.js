const { verificarFraude } = require('./controllers/fraudeController');

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/v1/validate/:user_id', verificarFraude);

app.listen(PORT, () => {
  console.log(`Microservicio de ventas y detección de fraude en el puerto ${PORT}`);
});
