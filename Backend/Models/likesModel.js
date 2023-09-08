const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema(
    {
        userId: String,
        productId: String,
        isLiked: Boolean,
    },
    {
        timestamps: true,
    }
);

const likesModel = mongoose.model('likes', likesSchema);

module.exports = likesModel;
