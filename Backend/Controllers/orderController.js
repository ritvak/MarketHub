const orderModel = require('../Models/orderModel');
const { ObjectId } = require('mongodb');

const getOrders = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { type } = req.body;

    let orders;

    if (type === 'paid') {
      orders = await orderModel.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $addFields: {
            userIdObjId: { $toObjectId: '$recipientId' },
            chatIdObjId: { $toObjectId: '$chatId' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userIdObjId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $lookup: {
            from: 'chats',
            localField: 'chatIdObjId',
            foreignField: '_id',
            as: 'chatDetails',
          },
        },
        {
          $group: {
            _id: '$_id',
            createdAt: { $first: '$createdAt' },
            orderId: { $first: '$orderId' },
            amount: { $first: '$amount' },
            userDetails: { $first: { $arrayElemAt: ['$userDetails', 0] } },
            chatDetails: { $first: { $arrayElemAt: ['$chatDetails', 0] } },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
    } else {
      orders = await orderModel.aggregate([
        {
          $match: {
            recipientId: userId,
          },
        },
        {
          $addFields: {
            userIdObjId: { $toObjectId: '$userId' },
            chatIdObjId: { $toObjectId: '$chatId' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userIdObjId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $lookup: {
            from: 'chats',
            localField: 'chatIdObjId',
            foreignField: '_id',
            as: 'chatDetails',
          },
        },
        {
          $group: {
            _id: '$_id',
            createdAt: { $first: '$createdAt' },
            orderId: { $first: '$orderId' },
            amount: { $first: '$amount' },
            userDetails: { $first: { $arrayElemAt: ['$userDetails', 0] } },
            chatDetails: { $first: { $arrayElemAt: ['$chatDetails', 0] } },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
    }

    res.status(200).json({
      status: 200,
      orders,
      message: 'Success',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { getOrders };
