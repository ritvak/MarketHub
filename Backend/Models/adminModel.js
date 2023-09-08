const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    facebookId: { type: String, required: false },
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: false, unique: true },
    postalCode: { type: String, required: false },
    password: { type: String, required: false },
    token: { type: String, required: false },
    verifyToken: { type: String, required: false },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model('user', adminSchema);

module.exports = adminModel;
