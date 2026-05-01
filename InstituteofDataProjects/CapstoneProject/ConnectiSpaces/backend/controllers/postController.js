"use strict";
let Models = require("../models");

// Get all posts
const getPosts = (res) => {
  Models.Post.find({})
    .populate("author_id")
    .sort({ created_at: -1 })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Create a new post
const createPost = (data, res) => {
  console.log(data);

  new Models.Post(data)
    .save()
    .then((savedPost) => {
      return Models.Post.findById(savedPost._id).populate("author_id");
    })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Update a post by ID
const updatePost = (req, res) => {
  console.log(req.body);

  Models.Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("author_id")
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Delete a post by ID
const deletePost = (req, res) => {
  Models.Post.findByIdAndDelete(req.params.id)
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};