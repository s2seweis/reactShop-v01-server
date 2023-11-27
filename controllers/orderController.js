// orderController.js

const firebaseService = require('../services/firebaseService');

const createOrder = async (data, metadata, shipping) => {
  const newOrder2 = {
    amount: data.amount,
    id: data.id,
    currency: data.currency,
    status: data.status,
    customerId: data.metadata,

    shipping: data.shipping,
  }

  const newOrder = newOrder2;

  try {
    const savedOrder = await firebaseService.createOrder(newOrder);
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createOrder,
};
