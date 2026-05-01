 "use strict";
let express = require("express");
let router = express.Router();

let Controllers = require("../controllers");

// GET all reviews
router.get("/", (req, res) => {
  Controllers.reviewController.getReviews(res);
});

// GET reviews for a specific space
router.get("/space/:spaceId", (req, res) => {
  Controllers.reviewController.getReviewsBySpaceId(req, res);
});

// POST create a new review
router.post("/create", (req, res) => {
  Controllers.reviewController.createReview(req.body, res);
});

// PUT update a review by ID
router.put("/:id", (req, res) => {
  Controllers.reviewController.updateReview(req, res);
});

// DELETE a review by ID
router.delete("/:id", (req, res) => {
  Controllers.reviewController.deleteReview(req, res);
});

module.exports = router;