"use strict";
const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

router.get("/", async (req, res) => {
  try {
    const data = await Controllers.likeController.getAllLikes(req, res);
  } catch (err) {
    res.status(500).send({ result: 500, error: err.message });
  }
});

router.post("/create", Controllers.likeController.createLike);
router.delete("/remove", Controllers.likeController.removeLike);
router.get("/user/:userId", Controllers.likeController.getLikesByUser);
router.get("/post/:postId", Controllers.likeController.getLikesByPost);
router.get("/comment/:commentId", Controllers.likeController.getLikesByComment);
router.get("/", Controllers.likeController.getAllLikes);

module.exports = router;