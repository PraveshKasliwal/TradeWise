const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    stockSymbol: {
        type: String,
        required: true,
        index: true
    },
    stockName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    currency: {
        type: String,
        required: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
        index: true
    }
});

transactionSchema.index({ userId: 1, transactionDate: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);