const mongoose = require('mongoose');

const adminloginSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const adminloginModel = mongoose.model('adminlogin', adminloginSchema);

module.exports = adminloginModel;
