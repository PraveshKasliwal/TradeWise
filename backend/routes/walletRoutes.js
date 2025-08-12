const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController')

const isAuth = require('../middleware/isAuth');

router.get('/get-wallet/:id', isAuth, walletController.getWallet);

// Create order
router.post('/create-order', isAuth, walletController.createOrder);

// Verify payment
router.post('/verify-payment', isAuth, walletController.verifyPayment);

module.exports = router;
