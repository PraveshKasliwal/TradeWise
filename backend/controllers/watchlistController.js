const User = require('../models/User');

// GET /api/watchlist/:userId
exports.getWatchlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// POST /api/watchlist/add
exports.addToWatchlist = async (req, res) => {
  const { userId, symbol } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const alreadyExists = user.watchlist.some(item => item.stockSymbol === symbol);
    if (!alreadyExists) {
      user.watchlist.push({ stockSymbol: symbol });
      await user.save();
    }

    // Emit update to this user
    global._io.to(userId).emit("watchlist:updated", user.watchlist);

    res.json({ msg: 'Added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// POST /api/watchlist/remove
exports.removeFromWatchlist = async (req, res) => {
  const { userId, symbol } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.watchlist = user.watchlist.filter(item => item.stockSymbol !== symbol);
    await user.save();

    // Emit update to this user
    global._io.to(userId).emit("watchlist:updated", user.watchlist);

    res.json({ msg: 'Removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};