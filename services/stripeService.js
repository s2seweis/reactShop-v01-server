// stripeService.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
  });
  
  const createPaymentIntent = async (items, price, shipping) => {
    const customer = await stripe.customers.create({
      // Customer creation details
    });
  
    // Calculate the order amount using your logic
    const orderAmount = 1400;
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      customer: customer.id,
      metadata: {
        cartItems: JSON.stringify(items),
      },
    });
  
    return paymentIntent;
  };
  
  module.exports = {
    createPaymentIntent,
  };
  