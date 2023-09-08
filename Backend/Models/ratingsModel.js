const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema(
    {
        userId: String,
        productId: String,
        ratings: {
            type: Number,
            default: 0,
          },
    },
    {
        timestamps: true,
    }
);

const ratingsModel = mongoose.model('ratings', ratingsSchema);

module.exports = ratingsModel;
