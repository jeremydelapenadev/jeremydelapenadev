"use strict";
let express = require("express");
let router = express.Router();

let Controllers = require("../controllers");

// GET all comments
router.get("/", (req, res) => {
  Controllers.commentController.getComments(res);
});

// GET comments for one specific post
router.get("/post/:postId", (req, res) => {
  Controllers.commentController.getCommentsByPost(req, res);
});

// POST create a new comment
router.post("/create", (req, res) => {
  Controllers.commentController.createComment(req.body, res);
});

// PUT update a comment by ID
router.put("/:id", (req, res) => {
  Controllers.commentController.updateComment(req, res);
});

// DELETE a comment by ID
router.delete("/:id", (req, res) => {
  Controllers.commentController.deleteComment(req, res);
});

module.exports = router;