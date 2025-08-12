const User = require("../models/User");
const fetchFormattedStockData = require("../utils/fetchFormattedStockData");

const WatchlistSocketHandler = (socket) => {
  socket.on("watchlist:get", async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) return;
      socket.emit("watchlist:updated", user.watchlist);
    } catch (err) {
      console.error("Failed to fetch watchlist via socket:", err.message);
    }
  });

  socket.on("watchlist:stockData", async (symbols) => {
    try {
      const formattedData = await fetchFormattedStockData(symbols);
      socket.emit("watchlist:stockData:result", formattedData);
    } catch (err) {
      console.error("Failed to fetch stock data for watchlist:", err.message);
    }
  });
};

module.exports = WatchlistSocketHandler;
