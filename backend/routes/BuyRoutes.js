const express = require('express');
const router = express.Router();

const buyController = require('../controllers/BuyController');
const isAuth = require('../middleware/isAuth');


// Buy Stock and Deduct from Wallet
router.post('/buy', isAuth, buyController.postTrade);

router.post('/sell', isAuth, buyController.sellStock);

module.exports = router;
