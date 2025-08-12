const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const isAuth = require('../middleware/isAuth');

router.get('/:userId', isAuth, watchlistController.getWatchlist);
router.post('/add', isAuth, watchlistController.addToWatchlist);
router.post('/remove', isAuth, watchlistController.removeFromWatchlist);

module.exports = router;
