const axios = require('axios');
const ordersMock = require('../mocks/orderResponseMocks.json');

const valorfraude = 10; // Máximo de órdenes o transacciones permitidas por día
const montoMaximo = 10000; // Monto acumulado máximo permitido

// Algoritmo 1: Detección de fraude por cantidad de órdenes en un día (Órdenes)
const detectarFraudePorFecha = (orders, orderDate) => {
  const now = orderDate;
  //const now = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
  let contador_fraude = 0;

  for (let order of orders) {
    const orderDate = order.created_at.split('T')[0];  // Obtenemos solo la fecha de la orden
    console.log(`Comparando fecha de orden: ${order.created_at.split('T')[0]} con la fecha actual: ${now}`);
    if (orderDate === now) {
      contador_fraude++;
      console.log(`Orden detectada: ${order.order_id}, Contador de fraude: ${contador_fraude}`);
      if (contador_fraude > valorfraude) {
        console.log('Fraude detectado por cantidad de órdenes.');
        return true; // Fraude detectado
      }
    }
  }
  console.log('No se detectó fraude por cantidad de órdenes.');
  return false; // No se detectó fraude
};

// Algoritmo 2: Detección de fraude por monto acumulado de ventas
const detectarFraudePorMonto = (orders, orderDate) => {
  const now = orderDate;
  //const now = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
  let acum_precio = 0;
  let cont_fecha = 0;

  for (let order of orders) {
    const orderDate = order.created_at.split('T')[0];  // Obtenemos solo la fecha de la orden
    if (orderDate === now && order.status === 'approved') {
      acum_precio += order.price;
      cont_fecha++;
      console.log(`Monto acumulado: ${acum_precio}, Contador de órdenes: ${cont_fecha}`);
      if (cont_fecha > valorfraude || acum_precio > montoMaximo) {
        console.log('Fraude detectado por monto acumulado o cantidad de órdenes.');
        return true; // Fraude detectado
      }
    }
  }
  console.log('No se detectó fraude por monto acumulado.');
  return false; // No se detectó fraude
};

// Controlador para verificar fraude
const verificarFraude = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { order_date: orderDate } = req.query;

    // Simular respuesta de API externa usando mocks
    console.log("Datos de órdenes:", JSON.stringify(ordersMock));
    const orders = ordersMock.data;

    // Aplicar ambos algoritmos de detección de fraude
    const esFraudePorFecha = detectarFraudePorFecha(orders , orderDate);
    const esFraudePorMonto = detectarFraudePorMonto(orders);

    // Determinar si se detecta fraude
    const esFraude = esFraudePorFecha || esFraudePorMonto;
    res.status(200).json({ is_fraud: esFraude });
  } catch (error) {
    console.error('Error al verificar fraude:', error);
    res.status(500).send('Error al verificar fraude');  
  }
};

module.exports = { verificarFraude };
