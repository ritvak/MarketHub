const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    recipientId: { type: String, require: true },
    orderId: { type: String },
    chatId: { type: String, require: true },
    amount: { type: Number, require: true },
    paymentStatus: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
