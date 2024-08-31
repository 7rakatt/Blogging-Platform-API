const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  tags: {
    type: [String],
    require: true,
  },
  createdAt: {
    type:Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Post',postSchema);