const express = require('express');
const router = express.Router();
const SubscriptionTemplate = require('../models/SubscriptionTemplate');
const auth = require('../middleware/auth');

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await SubscriptionTemplate.find();
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subscription (admin only - simplified for MVP)
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, monthlyPrice, maxUsers } = req.body;

    const subscription = new SubscriptionTemplate({
      name,
      icon,
      monthlyPrice,
      maxUsers,
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;