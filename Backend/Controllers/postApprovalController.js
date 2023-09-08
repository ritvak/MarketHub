const postApprovalModel = require('../Models/postApprovalModel');

const getAllProducts = async (req, res) => {
  try {
    const products = await postApprovalModel.find();

    res.status(200).json({
      message: 'successful',
      userData: products,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await postApprovalModel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product approved successfully',
      product: product,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await postApprovalModel.findByIdAndUpdate(
      id,
      { isApproved: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product rejected successfully',
      product: product,
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};
module.exports = { getAllProducts, approveProduct, rejectProduct };
