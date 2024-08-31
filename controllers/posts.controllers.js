const { validationResult } = require("express-validator");
const Post = require("../models/postSchema");
const httpStatustext = require("../utils/httpstatustxt");
const appError = require("../utils/appError");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllposts = asyncWrapper(async (req, res) => {
  const { term } = req.query;
  let filtered = {};
  if (term) {
    filtered = {
      $or: [
        { title: { $regex: term, $options: "i" } },      // Case-insensitive search on title
        { content: { $regex: term, $options: "i" } },    // Case-insensitive search on content
        { category: { $regex: term, $options: "i" } },   // Case-insensitive search on category
        { tags: { $regex: term, $options: "i" } },       // Case-insensitive search on tags (array)
      ],
    };
  }
  const posts = await Post.find(filtered, { __v: 0 });
  res.status(200).json({ status: "success", data: { posts } })
});


const getOnePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    const error = appError.creat("post not found", 404, httpStatustext.FAIL);
    return next(error);
  }
  return res.json({ status: httpStatustext.SUCCESS, data: { post } });
});

const addPost = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.creat(errors.array(), 400, httpStatustext.FAIL);
    return next(error);
  }
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json({ status: httpStatustext.SUCCESS, data: { newPost } });
});

const deletePost = asyncWrapper(async (req, res) => {
  const postId = req.params.postId;
  await Post.deleteOne({ _id: postId });
  res.status(200).json({ status: httpStatustext.SUCCESS, data: null });
});

const updetePost = asyncWrapper(async (req, res) => {
  const postId = req.params.postId;
  const datatoUpdate = req.body;
  const post = await Post.findByIdAndUpdate(
    postId,
    { ...datatoUpdate,updatedAt: Date.now() },
    {
      new: true,
      runValidators:true
    }
  );
  res.status(200).json({ status: httpStatustext.SUCCESS, data: { post } });
});

module.exports = {
  getAllposts,
  getOnePost,
  addPost,
  deletePost,
  updetePost,
};
