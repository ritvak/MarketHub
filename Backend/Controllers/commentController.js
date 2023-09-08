const Comment = require('../Models/commentModel');
const userModel = require('../Models/userModel');


// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const userId = res.locals.user._id.toString();
    const user = await userModel.findOne({
      _id:userId,
    });

    const { productId, comment } = req.body;
    const commentAdd = new Comment({
      userId,
      productId,
      comment,
      user:user.name,

    });

    await commentAdd.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get all comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const  {productId}  = req.body;

    const comments = await Comment.find({ productId })
    .sort({ createdAt: -1 }) 
    .exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};
