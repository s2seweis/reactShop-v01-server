// firebaseService.js

const firebase = require('firebase');
const firebaseConfig = require('../config/firebaseConfig');

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const createOrder = async (newOrder) => {
  try {
    const savedOrder = await firestore.collection('orders1').doc().set(newOrder);
    return savedOrder;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createOrder,
};
