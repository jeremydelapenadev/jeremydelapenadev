"use strict";
let Models = require("../models");

// Get all reviews
const getReviews = (res) => {
  Models.Review.find({})
    .populate("author_id", "username email")
    .populate("space_id", "name")
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Get reviews by space ID
const getReviewsBySpaceId = (req, res) => {
  Models.Review.find({ space_id: req.params.spaceId })
    .populate("author_id", "username email")
    .sort({ created_at: -1 })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Create a new review
const createReview = (data, res) => {
  console.log(data);
  new Models.Review(data)
    .save()
    .then((savedReview) => {
      return Models.Review.findById(savedReview._id)
        .populate("author_id", "username email")
        .populate("space_id", "name");
    })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Update a review by ID
const updateReview = (req, res) => {
  console.log(req.body);
  Models.Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// Delete a review by ID
const deleteReview = (req, res) => {
  Models.Review.findByIdAndDelete(req.params.id)
    .then((data) => res.send({ result: 200, data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getReviews,
  getReviewsBySpaceId,
  createReview,
  updateReview,
  deleteReview,
};