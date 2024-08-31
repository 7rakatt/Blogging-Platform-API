const express = require('express')
const app = express()
const mongoose = require('mongoose')
const postRouter = require('./routes/posts.route')
const httpStatustxt = require("./utils/httpstatustxt");
require("dotenv").config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('connected to DB')
})

app.use('/', postRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: httpStatustxt.ERROR,
    message: "this resource is not avilable",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatustxt.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT, () => {
  console.log('listening...');
})