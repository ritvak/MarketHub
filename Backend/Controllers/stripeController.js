const StripeRoute = require('stripe');
const orderModel = require('../Models/orderModel');
const messageModel = require('../Models/messageModel');

require('dotenv').config();

const stripe = StripeRoute(process.env.STRIPE_KEY);
const createCheckoutSession = async (req, res) => {
  try {
    const { location, amount, name, chatId, recipientId } = req.body;
    const userId = res.locals.user._id.toString();

    const customer = await stripe.customers.create({
      metadata: {
        userId,
        chatId,
        recipientId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}${location}`,
      cancel_url: `${process.env.FRONTEND_URL}${location}`,
    });

    res.status(200).json({
      status: 200,
      url: session.url,
      message: 'Success',
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const createOrder = async (customer, data) => {
  try {
    const newOrder = new orderModel({
      userId: customer.metadata.userId,
      recipientId: customer.metadata.recipientId,
      orderId: data.customer,
      chatId: customer.metadata.chatId,
      amount: data.amount_total / 100,
      paymentStatus: data.paymentStatus,
    });

    const message = new messageModel({
      chatId: customer.metadata.chatId,
      senderId: customer.metadata.userId,
      content: `Payment of $${data.amount_total / 100} is successful`,
      isImage: false,
      isPayment: true,
    });

    await message.save();

    const savedOrder = await newOrder.save();

    global.io.emit('paymentSuccessful', savedOrder);
  } catch (e) {
    console.log(e);
  }
};

const stripeWebhook = async (request, response) => {
  try {
    const sig = request.headers['stripe-signature'];

    let data;
    let eventType;
    data = request.body.data.object;
    eventType = request.body.type;

    if (eventType === 'checkout.session.completed') {
      stripe.customers
        .retrieve(data.customer)
        .then(customer => {
          createOrder(customer, data);
        })
        .catch(err => console.log(err));
    }
    response.send().end();
  } catch (e) {
    response.status(500).json({
      message: e,
    });
  }
};

module.exports = { createCheckoutSession, stripeWebhook };
