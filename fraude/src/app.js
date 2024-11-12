const express = require('express');
const app = express();
const PORT = 3000;

// Importar el controlador de fraude
const { verificarFraude } = require('./controllers/fraudeController');

// Middleware para analizar JSON (opcional, si necesitas manejar POST requests con datos en JSON en el futuro)
app.use(express.json());

// Endpoint GET para obtener órdenes de un usuario específico
// Nota: Este endpoint ya lo consulta el controlador de fraude
app.get('/api/v1/orders/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    
    // Suponiendo que tienes una función que obtiene órdenes del usuario (si usas una base de datos, esta sería la consulta):
    // const ventasUsuario = await getOrdersFromDB(userId);

    // Si estás trabajando localmente y quieres datos de prueba:
    const ventas = []; // Aquí deberías cargar tus datos locales o conectarte a tu base de datos

    const ventasUsuario = ventas.filter((venta) => venta.user_id === Number(userId));
    res.status(200).json(ventasUsuario);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).send('Error al obtener órdenes');
  }
});

// Endpoint GET para verificar fraude de un usuario específico
app.get('/api/v1/validate/:user_id', verificarFraude);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Microservicio de ventas y detección de fraude en el puerto ${PORT}`);
});
