const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: false },
    img: { type: String, required: false },
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: false, unique: true },
    postalCode: { type: String, required: false },
    city: { type: String, required: false },
    mobile: { type: String, required: false },
    password: { type: String, required: false },
    token: { type: String, required: false },
    verifyToken: { type: String, required: false },
    status: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
