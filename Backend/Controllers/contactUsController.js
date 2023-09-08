const contactModel = require('../Models/contactUsModel');


const SetContactDetails = async (req, res) => {
  try {
    const { firstName, lastName, email, contactReason } = req.body;

    const contact = new contactModel({
      firstName,
      lastName,
      email,
      contactReason,
    });

    const response = await contact.save();

    res.status(200).json({
      status: 200,
      contactData: response,
      message: 'Success',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};


module.exports = {SetContactDetails };
