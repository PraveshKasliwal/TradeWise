require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User"); // Import User model
const axios = require("axios");

// Routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require('./routes/stockRoutes');
const chartRoutes = require('./routes/chartRoutes');
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes');
const buyRoutes = require('./routes/BuyRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const subscribeStockHandler = require('./SocketHandler/subscribeStockHandler');
const WatchlistSocketHandler = require('./SocketHandler/WatchlistSocketHandler');
const WalletSocketHandler = require('./SocketHandler/WalletSocketHandler');

const app = express();
const server = http.createServer(app); // wrap app with HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend origin
    methods: ["GET", "POST"]
  }
});

// Export io globally to use in controllers
global._io = io;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transaction', buyRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Socket events
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // user-specific room
  });

  socket.on("watchlist:update", ({ userId, updated }) => {
    io.to(userId).emit("watchlist:updated", updated);
  });

  socket.on("subscribeStock", (symbols) => {
    subscribeStockHandler(socket, symbols);
  });

  WatchlistSocketHandler(socket);

  WalletSocketHandler(socket);


  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});


// MongoDB Connection + Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server with Socket.IO running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));