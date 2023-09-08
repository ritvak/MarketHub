const chatModel = require('../Models/chatModel');
const productModel = require('../Models/productModel');
const { ObjectId } = require('mongodb');

const createChat = async (req, res) => {
  try {
    const firstId = res.locals.user._id.toString();
    console.log('firstId', firstId);
    const { secondId, productId } = req.body;

    const objectProductId = new ObjectId(productId);

    const productDetails = await productModel.findById(objectProductId);

    console.log(productDetails);

    const chat = await chatModel.findOne({
      productId,
      members: { $elemMatch: { $eq: firstId } },
    });

    console.log('chat', chat);

    if (chat)
      return res.status(200).json({
        status: 200,
        chat,
        message: 'Success',
      });

    const newChat = new chatModel({
      members: [firstId, secondId],
      productName: productDetails.productName,
      productId: productId,
    });

    const response = await newChat.save();

    await productModel.updateOne(
      { _id: productId },
      {
        $set: {
          isChatCreated: true,
          chatId: response._id.toString(),
        },
      }
    );

    res.status(200).json({
      status: 200,
      chat: response,
      message: 'Success',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const getUserChats = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    console.log(userId);
    const userObjectId = new ObjectId(userId);

    const allChats = await chatModel.aggregate([
      {
        $match: {
          members: { $in: [userId] },
        },
      },
      {
        $addFields: {
          productIdObjId: { $toObjectId: '$productId' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productIdObjId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$members',
      },
      {
        $addFields: {
          memberId: { $toObjectId: '$members' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'memberId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          members: { $push: '$members' },
          userDetails: { $push: { $arrayElemAt: ['$userDetails', 0] } },
          productId: { $first: '$productId' },
          productName: { $first: '$productName' },
          productDetails: { $first: { $arrayElemAt: ['$productDetails', 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          chatId: '$_id',
          productId: 1,
          productName: 1,
          createdAt: 1,
          productDetails: 1,
          userDetails: {
            $filter: {
              input: '$userDetails',
              as: 'user',
              cond: { $ne: ['$$user._id', userObjectId] },
            },
          },
          members: '$members',
        },
      },
      {
        $project: {
          userDetails: {
            password: 0,
            token: 0,
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      allChats,
      message: 'Success',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const findChat = async (req, res) => {
  try {
    const firstId = res.locals.user._id.toString();
    const { secondId } = req.params;

    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json({
      status: 200,
      chat,
      message: 'Success',
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { createChat, getUserChats, findChat };
