const axios = require('axios');
const mockOrders = require('../mocks/orderResponseMocks.json')

const valorfraude = 10; // Máximo de órdenes o transacciones permitidas por día
const montoMaximo = 10000; // Monto acumulado máximo permitido

// Algoritmo 1: Detección de fraude por cantidad de órdenes en un día (Órdenes)
const detectarFraudePorFecha = (orders) => {
  const now = new Date().toISOString().split('T')[0];
  let contador_fraude = 0;

  for (let order of orders) {
    if (order.created_at.split('T')[0] === now) {
      contador_fraude++;
      if (contador_fraude > valorfraude) {
        return true; // Fraude detectado
      }
    }
  }
  return false; // No se detectó fraude
};

// Algoritmo 2: Detección de fraude por monto acumulado de ventas (Ventas)
const detectarFraudePorMonto = (ventas) => {
  const now = new Date().toISOString().split('T')[0];
  let acum_precio = 0;
  let cont_fecha = 0;

  for (let venta of ventas) {
    if (venta.created_at.split('T')[0] === now && venta.status === 'approved') {
      acum_precio += venta.price;
      cont_fecha++;
      if (cont_fecha > valorfraude || acum_precio > montoMaximo) {
        return true; // Fraude detectado
      }
    }
  }
  return false; // No se detectó fraude
};

// Controlador para verificar fraude
const verificarFraude = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Obtener datos de órdenes desde la API de Órdenes
    // const ordersResponse = await axios.get(`http://localhost:3001/api/v1/orders/${user_id}`);
    const orders = ordersResponse.data;

    // Obtener datos de ventas desde la API de Ventas
    // const ventasResponse = await axios.get(`http://localhost:3002/api/v2/orders/${user_id}`);
    const ventas = ventasResponse.data;

    // Aplicar ambos algoritmos de detección de fraude
    const esFraudePorFecha = detectarFraudePorFecha(orders);
    const esFraudePorMonto = detectarFraudePorMonto(ventas);

    // Determinar si se detecta fraude
    const esFraude = esFraudePorFecha || esFraudePorMonto;
    res.status(200).json({ is_fraud: esFraude });
  } catch (error) {
    console.error('Error al verificar fraude:', error);
    res.status(500).send('Error al verificar fraude');
  }
};

module.exports = { verificarFraude };
