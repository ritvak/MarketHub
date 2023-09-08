const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        contactReason: String,
    },
    {
        timestamps: true,
    }
);

const contactModel = mongoose.model('contactUs', ContactUsSchema);

module.exports = contactModel;
