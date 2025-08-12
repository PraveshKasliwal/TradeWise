const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET_ID,
});

exports.getWallet = async (req, res) => {
    const userId = req.user.id;    // Assuming req.user is populated by the isAuth middleware
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } 
        res.status(200).json({ wallet: user.wallet });
    } catch (err) {
        console.error("Failed to fetch wallet:", err.message);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }   
}

exports.createOrder = async (req, res) => {
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET_ID:", process.env.RAZORPAY_KEY_SECRET_ID);

    const { amount } = req.body;
    console.log(amount);

    const options = {
        amount: amount * 100, // Razorpay works in paisa
        currency: 'INR',
        receipt: `wallet_rcpt_${Date.now()}`,
    };
    // console.log(options)
    try {
        const order = await razorpay.orders.create(options);
        // console.log('order', order)
        res.status(200).json({ order });
    } catch (err) {
        console.error("Razorpay Order Creation Error:", {
            message: err.message,
            statusCode: err.statusCode,
            error: err.error,
            response: err.response?.data,
        });
        res.status(500).json({ error: 'Failed to create order' });
    }

};

exports.verifyPayment = async (req, res) => {
    const { response, amount, userId } = req.body;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET_ID)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        // ✅ Add amount to wallet in DB (pseudo-code)
        await User.updateOne(
            { _id: userId },
            { $inc: { wallet: Number(amount) } }
        );

        return res.status(200).json({ success: true });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
}