// paymentController.js

const stripeService = require('../services/stripeService');
const orderController = require('./orderController');

const createPaymentIntent = async (req, res) => {
  try {
    const { items, price, shipping } = req.body;
    const paymentIntent = await stripeService.createPaymentIntent(items, price, shipping);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Error creating payment intent' });
  }
};

module.exports = {
  createPaymentIntent,
};
