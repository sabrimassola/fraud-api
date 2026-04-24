const ordersMock = require('../mocks/orderResponseMocks.json');

const valorfraude = 10; 
const montoMaximo = 10000; 

//Detección de fraude por cantidad de órdenes en un día
const detectarFraudePorFecha = (orders, orderDate) => {
  const now = orderDate;
  let contador_fraude = 0;

  for (let order of orders) {
    const orderDate = order.created_at.split('T')[0]; 
    console.log(`Comparando fecha de orden: ${order.created_at.split('T')[0]} con la fecha actual: ${now}`);
    if (orderDate === now) {
      contador_fraude++;
      console.log(`Orden detectada: ${order.order_id}, Contador de fraude: ${contador_fraude}`);
      if (contador_fraude > valorfraude) {
        console.log('Fraude detectado por cantidad de órdenes.');
        return true; 
      }
    }
  }
  console.log('No se detectó fraude por cantidad de órdenes.');
  return false; 
};

// Detección de fraude por monto acumulado de ventas
const detectarFraudePorMonto = (orders, orderDate) => {
  const now = orderDate;
  let acum_precio = 0;
  let cont_fecha = 0;

  for (let order of orders) {
    const orderDate = order.created_at.split('T')[0];
    if (orderDate === now && order.status === 'approved') {
      acum_precio += order.price;
      cont_fecha++;
      console.log(`Monto acumulado: ${acum_precio}, Contador de órdenes: ${cont_fecha}`);
      if (cont_fecha > valorfraude || acum_precio > montoMaximo) {
        console.log('Fraude detectado por monto acumulado o cantidad de órdenes.');
        return true; 
      }
    }
  }
  console.log('No se detectó fraude por monto acumulado.');
  return false; 
};


const verificarFraude = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { order_date: orderDate } = req.query;

    console.log("Datos de órdenes:", JSON.stringify(ordersMock));
    const orders = ordersMock.data;

    const esFraudePorFecha = detectarFraudePorFecha(orders , orderDate);
    const esFraudePorMonto = detectarFraudePorMonto(orders , orderDate);

    const esFraude = esFraudePorFecha || esFraudePorMonto;
    res.status(200).json({ is_fraud: esFraude });
  } catch (error) {
    console.error('Error al verificar fraude:', error);
    res.status(500).send('Error al verificar fraude');  
  }
};

module.exports = { verificarFraude };
