const mongoose = require('mongoose')
const User = require("../models/User");
const Transaction = require('../models/Transaction');

exports.getUser = async (req, res) => {
    try {
        // console.log('here');
        const userId = req.params.id;
        // console.log("userId", userId)

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await User.findById(userId);
        // console.log("user", user);
        if (!user)
            return res.status(400).json({ message: "User does not exist" });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUserTransactions = async (req, res) => {
    const { userId } = req.params;
    // console.log(userId);

    try {
        const transactions = await Transaction.find({ userId })
            .sort({ transactionDate: -1 }); // most recent first
        // console.log(transactions);
        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ success: false, message: 'Server error fetching transactions' });
    }
}

exports.getUserPortfolio = async (req, res) => {
    const { userId } = req.params;
    // console.log('userId: '.userId)

    try {
        const user = await User.findById({ _id: userId });
        const userPortfolio = user.portfolio;
        res.json({ userPortfolio });
    }
    catch (error) {
        console.log('Portfolio error: ', error)
        res.status(500).json({ succes: false, message: 'Server error fetching portfolio' })
    }
} 