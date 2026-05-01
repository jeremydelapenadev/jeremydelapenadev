"use strict";
let express = require("express");
let router = express.Router();

let Controllers = require("../controllers"); // index.js

// GET all posts
router.get("/", (req, res) => {
  Controllers.postController.getPosts(res);
});

// POST create a new post
router.post("/create", (req, res) => {
  Controllers.postController.createPost(req.body, res);
});

// PUT update a post by ID
router.put("/:id", (req, res) => {
  Controllers.postController.updatePost(req, res);
});

// DELETE a post by ID
router.delete("/:id", (req, res) => {
  Controllers.postController.deletePost(req, res);
});

module.exports = router;