const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.postTrade = async (req, res) => {
  const { userId, stockSymbol, stockName, quantity, price, currency } = req.body;
  // console.log("BuyController postTrade called with:", req.body);
  const totalAmount = quantity * price;

  try {
    // 1. Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.wallet < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // 2. Save transaction
    const transaction = new Transaction({
      userId,
      stockSymbol,
      stockName,
      quantity,
      price,
      totalAmount,
      currency: currency,
      type: 'BUY',
    });
    await transaction.save();

    // 3. Deduct from wallet
    user.wallet -= totalAmount;

    // 4. Update portfolio (maintaining average price if already owned)
    const index = user.portfolio.findIndex(p => p.stockSymbol === stockSymbol);
    if (index > -1) {
      const existing = user.portfolio[index];
      const newQty = existing.quantity + quantity;
      const newAvgPrice =
        ((existing.purchasedPrice * existing.quantity) + (price * quantity)) / newQty;

      user.portfolio[index].quantity = newQty;
      user.portfolio[index].purchasedPrice = newAvgPrice;
    } else {
      user.portfolio.push({
        stockSymbol,
        quantity,
        purchasedPrice: price,
      });
    }

    await user.save();

    res.json({ success: true, transaction });
  } catch (err) {
    console.error("buy error", err);
    res.status(500).json({ success: false, error: 'Buy transaction failed' });
  }
}

exports.sellStock = async (req, res) => {
  try {
    const { userId, stockSymbol, stockName, quantity, price, currency } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const portfolioItem = user.portfolio.find(p => p.stockSymbol === stockSymbol);

    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity to sell' });
    }

    const totalAmount = price * quantity;
    const avgPurchasePrice = portfolioItem.purchasedPrice;
    const profitOrLoss = (price - avgPurchasePrice) * quantity;

    // Update transaction
    const transaction = new Transaction({
      userId,
      stockSymbol,
      stockName,
      quantity,
      price,
      totalAmount,
      currency,
      type: 'SELL',
    });
    await transaction.save();

    // Update portfolio
    if (portfolioItem.quantity === quantity) {
      user.portfolio = user.portfolio.filter(p => p.stockSymbol !== stockSymbol);
    } else {
      portfolioItem.quantity -= quantity;
    }

    // Update wallet
    user.wallet += totalAmount;

    await user.save();

    res.status(200).json({ success: true, message: 'Stock sold successfully', profitOrLoss });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};