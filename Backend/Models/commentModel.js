const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        userId: String,
        productId: String,
        comment: String,
        user: String,
    },
    {
        timestamps: true,
    }
);

const commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;
