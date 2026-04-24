const ordersMock = require('../mocks/orderResponseMocks.json');

const MAX_ORDERS_PER_DAY = 10;
const MAX_DAILY_AMOUNT = 10000;

const getOrderDate = (createdAt) => createdAt.split('T')[0];

const hasExceededDailyOrders = (orders, orderDate) => {
  let orderCount = 0;

  for (const order of orders) {
    if (getOrderDate(order.created_at) === orderDate) {
      orderCount++;

      if (orderCount > MAX_ORDERS_PER_DAY) {
        return true;
      }
    }
  }

  return false;
};

const hasExceededDailyAmount = (orders, orderDate) => {
  let accumulatedAmount = 0;
  let approvedOrdersCount = 0;

  for (const order of orders) {
    const isSameDate = getOrderDate(order.created_at) === orderDate;
    const isApproved = order.status === 'approved';

    if (isSameDate && isApproved) {
      accumulatedAmount += order.price;
      approvedOrdersCount++;

      if (
        approvedOrdersCount > MAX_ORDERS_PER_DAY ||
        accumulatedAmount > MAX_DAILY_AMOUNT
      ) {
        return true;
      }
    }
  }

  return false;
};

const verificarFraude = (req, res) => {
  try {
    const { user_id } = req.params;
    const { order_date: orderDate } = req.query;

    if (!orderDate) {
      return res.status(400).json({
        error: 'order_date query parameter is required',
      });
    }

    const orders = ordersMock.data.filter(
      (order) => String(order.user_id) === String(user_id)
    );

    const isFraudByOrders = hasExceededDailyOrders(orders, orderDate);
    const isFraudByAmount = hasExceededDailyAmount(orders, orderDate);

    return res.status(200).json({
      user_id,
      order_date: orderDate,
      is_fraud: isFraudByOrders || isFraudByAmount,
    });
  } catch (error) {
    console.error('Error checking fraud:', error);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

module.exports = { verificarFraude };
