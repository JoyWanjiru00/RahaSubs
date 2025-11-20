const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Top up wallet
router.post('/topup', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance += amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'topup',
      amount,
      description: 'Wallet top-up',
    });
    await transaction.save();

    res.json({
      walletBalance: user.walletBalance,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        description: transaction.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw from wallet
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.walletBalance -= amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'withdrawal',
      amount,
      description: 'Wallet withdrawal',
    });
    await transaction.save();

    res.json({
      walletBalance: user.walletBalance,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        description: transaction.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    const formattedTransactions = transactions.map(t => ({
      id: t._id,
      type: t.type,
      amount: t.amount,
      timestamp: t.timestamp,
      description: t.description,
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;