"use strict";
let Models = require("../models");

// Get all comments
const getComments = (res) => {
  Models.Comment.find({})
    .populate("user_id")
    .sort({ created_at: -1 })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Get comments for a specific post
const getCommentsByPost = (req, res) => {
  Models.Comment.find({ post_id: req.params.postId })
    .populate("user_id")
    .sort({ created_at: -1 })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Create a new comment
const createComment = (data, res) => {
  new Models.Comment(data)
    .save()
    .then((savedComment) => {
      return Models.Comment.findById(savedComment._id).populate("user_id");
    })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Update a comment by ID
const updateComment = (req, res) => {
  Models.Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Delete a comment by ID
const deleteComment = (req, res) => {
  Models.Comment.findByIdAndDelete(req.params.id)
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getComments,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};