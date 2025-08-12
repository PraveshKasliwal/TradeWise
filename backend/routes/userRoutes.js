const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

const isAuth = require('../middleware/isAuth');

router.get('/:id', isAuth, userController.getUser);

router.get('/transaction/:userId', isAuth, userController.getUserTransactions);

router.get('/portfolio/:userId', isAuth, userController.getUserPortfolio);

module.exports = router;
