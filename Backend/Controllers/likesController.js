const likesModel = require('../Models/likesModel');
const productModel = require('../Models/productModel');



const setLike = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { productId, isLiked} = req.body;

    const existingLike = await likesModel.findOne({ userId, productId });
    let message;
    let updatedLike;
    if (existingLike) {
        
        if(existingLike.isLiked==false){
            existingLike.isLiked = true;
            updatedLike = await existingLike.save(); 
            message="Liked Successfully."
        }
        else{
            existingLike.isLiked = false;
            updatedLike = await existingLike.save();
            message="Disliked Successfully."
        }
        
        // Add total likes
        const totalLikes = await likesModel.countDocuments({ productId, isLiked: true });
        await productModel.findByIdAndUpdate(productId, { isLikedTotal: totalLikes });

          res.status(200).json({
            status: 200,
            likesData: updatedLike,
            message: message,
          });
          return;
          
      }

    const newLike = new likesModel({
        userId,
        productId,
        isLiked,
    });

    const response = await newLike.save();
    // Add total likes
    const totalLikes = await likesModel.countDocuments({ productId, isLiked: true });
    await productModel.findByIdAndUpdate(productId, { isLikedTotal: totalLikes });

    res.status(200).json({
      status: 200,
      likesData: response,
      message: 'Liked Successfully For the first time.',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { setLike };
