const User = require("../models/User");

const WalletSocketHandler = (socket) => {
    socket.on("wallet:get", async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) return;
            socket.emit("wallet:result", user.wallet);
        } catch (err) {
            console.error("Failed to fetch wallet via socket:", err.message);
            socket.emit("wallet:result", 0); // fallback
        }
    });
};

module.exports = WalletSocketHandler;
