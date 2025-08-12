const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: {
    type: Number,
    default: 0,
  },
  watchlist: [{
    stockSymbol: {
      type: String
    }
  }],
  portfolio: [{
    stockSymbol: {
      type: String
    },
    quantity: {
      type: Number
    },
    purchasedPrice: {
      type: Number
    },
  }]
});

module.exports = mongoose.model("User", userSchema);