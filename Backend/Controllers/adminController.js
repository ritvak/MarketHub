const adminModel = require('../Models/adminModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminModel.find();

    res.status(200).json({
      message: 'successful',
      userData: users,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminModel.findByIdAndUpdate(id, { status: true }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'User blocked successfully',
      user: user,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminModel.findByIdAndUpdate(id, { status: false }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'User unblocked successfully',
      user: user,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { getAllUsers, blockUser, unblockUser };
