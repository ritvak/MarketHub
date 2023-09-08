const productModel = require('../Models/productModel');
const chatModel = require('../Models/chatModel');
const likesModel = require('../Models/likesModel');

const createProduct = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { productName, productDescription, price, image } = req.body;

    const newProduct = new productModel({
      productName,
      productDescription,
      price,
      image,
      userId,
      isChatCreated: false,
      chatId: null,
      isApproved: false,
      deletedAt: false,
    });

    const response = await newProduct.save();

    res.status(200).json({
      status: 200,
      productData: response,
      message: 'Product Added Sucessfully',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const getALlProducts = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    let products = await productModel.find({   $and: [     { userId: { $nin: [userId] } },     { isApproved: true }, { isDeleted: false  }   ] });
    const searchTerm = req.body.searchTerm;
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      products = products.filter(
        (product) =>
          product.productName.match(regex) || product.productDescription.match(regex)
      );
    }
    const likedProducts = await likesModel.find({ userId, isLiked: true });

  likedProducts.forEach(likedProduct => {
    const product = products.find(product => product._id.toString() === likedProduct.productId);
    if (product) {
      product.isLiked = true;
    }
  });

    res.status(200).json({
      status: 200,
      products,
      message: 'Success',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const  {productId}  = req.body;
    
    const product = await productModel.find({ _id:productId});
    res.status(200).json(product);
  } 
  catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const suggestion = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const products = await productModel.find({
      $or: [
        { productName: { $regex: escapedSearchTerm, $options: 'i' } },
        { productDescription: { $regex: escapedSearchTerm, $options: 'i' } },
      ],
    }).limit(5);
    const suggestionData = products.map((product) => ({
      name: product.productName,
      id: product._id,
    }));

    res.json(suggestionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const sorting = async (req, res) => {
  try {
    const { sortingOption } = req.body;
    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const products = await productModel.find({
      $or: [
        { productName: { $regex: escapedSearchTerm, $options: 'i' } },
        { productDescription: { $regex: escapedSearchTerm, $options: 'i' } },
      ],
    }).limit(5);
    const suggestionData = products.map((product) => ({
      name: product.productName,
      id: product._id,
    }));

    res.json(suggestionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getUserProducts = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { type } = req.body;

    if (type === 'approved'){
      try{
      let products = await productModel.find({ userId: userId, isApproved: true, isDeleted: false});

      console.log(products);

        res.status(200).json({
          status: 200,
          products,
          message: 'Success',
        });
    }
    catch(e){
      console.log(e);
      res.status(500).json({
      message: e,
    });
    }
    }
    else{
      try{
      let products = await productModel.find({ userId: userId, isApproved: false, isDeleted: false });
      res.status(200).json({
        status: 200,
        products,
        message: 'Success',
    });
    }
    catch(e){
      console.log(e);
      res.status(500).json({
      message: e,
    });
    }
  }
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: 'Product not found',
      });
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      status: 200,
      message: 'Product Deleted Successfully',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { productId, image, productName, productDescription, price } = req.body; 
  try {

    const product = await productModel.findOne({ _id: productId });

    if(product){
      const updatedProduct = await productModel.findByIdAndUpdate(
        product._id,
        {
          image,
          productName,
          productDescription,
          price,
        },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({
          status: 404,
          message: 'Product not found',
        });
      }
  
      res.status(200).json({
        status: 200,
        message: 'Product updated successfully',
        updatedProduct,
      });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};



module.exports = { createProduct, getALlProducts,getOneProduct, getUserProducts, sorting, suggestion, deleteProduct, updateProduct };
