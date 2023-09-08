const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    productName: String,
    productDescription: String,
    userId: String,
    price: String,
    isChatCreated: Boolean,
    chatId: String,
    image: String,
    isLikedTotal: { type: Number, default: 0 },
    averageRatings: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const postApprovalModel = mongoose.model('products', postSchema);

module.exports = postApprovalModel;
