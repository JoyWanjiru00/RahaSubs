const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const SubscriptionTemplate = require('../models/SubscriptionTemplate');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Get all groups (user's groups)
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': req.user._id })
      .populate('subscription')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or join a group
router.post('/', auth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await SubscriptionTemplate.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if there's an existing group with available slots
    let group = await Group.findOne({
      subscription: subscriptionId,
      status: 'pending',
      'members.userId': { $ne: req.user._id },
    }).populate('subscription');

    if (group && group.members.length < subscription.maxUsers) {
      // Join existing group
      const shareAmount = subscription.monthlyPrice / subscription.maxUsers;
      
      group.members.push({
        userId: req.user._id,
        userName: req.user.name,
        paidStatus: false,
        amount: shareAmount,
      });

      await group.save();
      
      // Add group to user's joinedGroups
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { joinedGroups: group._id },
      });

      return res.status(201).json(group);
    }

    // Create new group
    const shareAmount = subscription.monthlyPrice / subscription.maxUsers;
    const nextRenewalDate = new Date();
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

    group = new Group({
      subscription: subscriptionId,
      createdBy: req.user._id,
      members: [{
        userId: req.user._id,
        userName: req.user.name,
        paidStatus: false,
        amount: shareAmount,
      }],
      totalPrice: subscription.monthlyPrice,
      status: 'pending',
      nextRenewalDate,
    });

    await group.save();
    await group.populate('subscription');

    // Add group to user's joinedGroups
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedGroups: group._id },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('subscription');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member
    const isMember = group.members.some(
      m => m.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay for subscription
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('subscription');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find user's membership
    const memberIndex = group.members.findIndex(
      m => m.userId.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const member = group.members[memberIndex];

    if (member.paidStatus) {
      return res.status(400).json({ message: 'Already paid' });
    }

    // Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < member.amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct from wallet
    user.walletBalance -= member.amount;
    await user.save();

    // Update payment status
    group.members[memberIndex].paidStatus = true;

    // Check if all members have paid
    const allPaid = group.members.every(m => m.paidStatus);
    if (allPaid) {
      group.status = 'active';
    }

    await group.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'subscription_payment',
      amount: member.amount,
      description: `Payment for ${group.subscription.name}`,
    });
    await transaction.save();

    res.json({
      group,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;