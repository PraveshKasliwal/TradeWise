const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// router.get('/:symbol', stockController.getStockData);

router.get('/:symbol', chartController.getChart);

// router.get('/nifty', stockController.getNiftyData);

module.exports = router;
