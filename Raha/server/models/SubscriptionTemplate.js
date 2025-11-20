const mongoose = require('mongoose');

const SubscriptionTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  maxUsers: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SubscriptionTemplate', SubscriptionTemplateSchema);