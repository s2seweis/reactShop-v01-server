const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const { resolve } = require('path');
const env = require('dotenv').config({ path: './.env' });
const apiRoutes = require('./routes/apiRoutes');
const firebaseService = require('./services/firebaseService');

// Initialize Firebase
app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(path);
});

app.get('/api/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.use('/api', apiRoutes);

app.post('/webhook', async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === 'payment_intent.succeeded') {
    try {
      // CREATE ORDER
      firebaseService.createOrder(data);
    } catch (err) {
      console.log(err);
    }

    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log('💰 Payment captured!');
  } else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.');
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () =>
  console.log(`Node server listening at http://localhost:${PORT}`)
);
