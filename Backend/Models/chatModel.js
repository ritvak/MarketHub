const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    members: Array,
    productName: String,
    productId: String,
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model('chat', chatSchema);

module.exports = chatModel;
