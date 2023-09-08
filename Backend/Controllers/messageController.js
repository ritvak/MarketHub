const messageModel = require('../Models/messageModel');

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, content, isImage, isPayment } = req.body;

    const message = new messageModel({
      chatId,
      senderId,
      content,
      isImage,
      isPayment,
    });

    const response = await message.save();

    res.status(200).json({
      status: 200,
      content: response,
      message: 'Successful',
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.body;

    const messages = await messageModel.find({ chatId });

    res.status(200).json({
      status: 200,
      content: messages,
      message: 'Successful',
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { createMessage, getMessages };
