const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const isAuth = require('../middleware/isAuth');

router.get('/:symbol', isAuth, stockController.getStockData);

router.post('/bulk', isAuth, stockController.getMultipleStockData);

router.post('/search', isAuth, stockController.getSearchStock);

router.post('/chart', isAuth, stockController.getStockChartData);

router.get('/fundamentals/income/:symbol', isAuth, stockController.getIncomeStatement);

// router.get('/nifty', stockController.getNiftyData);

// router.get('/multiple-stocks', stockController.getMultipleStocks);

module.exports = router;
