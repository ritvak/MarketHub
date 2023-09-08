const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decodedToken._id);
    if (user) {
      res.locals.user = user;
      next();
    } else throw 'Invalid token!';
  } catch (e) {
    res.status(401).json({
      status: 401,
      message: 'Invalid token!',
    });
  }
};
