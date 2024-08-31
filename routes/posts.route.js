const express = require('express')
const { body } = require("express-validator");
const postsControllers = require('../controllers/posts.controllers')
const Router = express.Router();

Router.route("/posts")
  .get(postsControllers.getAllposts)
  .post(
    [
      body("title")
        .notEmpty()
        .withMessage("title is require"),
      body("content").notEmpty().withMessage("content is require"),
      body("category").notEmpty().withMessage("category is require"),
      body("tags").isArray().withMessage("tags must be array")
    ],
    postsControllers.addPost
  );
  
Router.route("/posts/:postId")
  .delete(postsControllers.deletePost)
  .get(postsControllers.getOnePost)
  .put(postsControllers.updetePost);

module.exports = Router;