const ratingsModel = require('../Models/ratingsModel');
const productModel = require('../Models/productModel');



const setRating = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { productId, rateNumber} = req.body;
    const existingRating = await ratingsModel.findOne({ userId, productId });
    let message;
    // let updatedLike;
    if (existingRating) {
        
      await ratingsModel.findOneAndUpdate(
        {
          productId: productId,
          userId: userId
        },
        { ratings: rateNumber }
      );

      message="Ratings Changed";
    }
    else{
        const newRating = new ratingsModel({
            userId,
            productId,
            ratings: rateNumber,
        });
        message="Ratings for the first time";
    
        const response = await newRating.save();
    }
      
    const totalRatingsofPost = await ratingsModel.aggregate([
        {
          $match: { productId },
        },
        {
          $group: {
            _id: '$productId',
            totalRatings: { $sum: '$ratings' },
          },
        },
      ]);
    let countTotal = await ratingsModel.countDocuments({ productId });
    if(parseFloat(countTotal)===0){
      countTotal=1;
    }
    await productModel.findByIdAndUpdate(productId, { averageRatings: parseFloat((totalRatingsofPost[0].totalRatings)/countTotal) });


    // await productModel.findByIdAndUpdate(productId, { isLikedTotal: totalLikes });

    res.status(200).json({
      status: 200,
      message: message
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};


const getRating = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const { productId} = req.body;
    let averageRatings;
    let userRatings;
    const product = await productModel.findOne({_id:productId});
    if(product===null){
      averageRatings=0;
    }
    else{
      averageRatings=parseFloat(product['averageRatings']);
    }

    const userProduct = await ratingsModel.findOne({userId:userId, productId:productId});
    if(userProduct===null){
      userRatings=0;
    }
    else{
      userRatings=parseFloat(userProduct['ratings']);
    }

    const rate={
      averageRatings:averageRatings,
      userRatings:userRatings,
    }

    res.status(200).json({
      rate:rate
      // message: message
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};

module.exports = { setRating, getRating };
