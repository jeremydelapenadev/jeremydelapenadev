"use strict";
let Models = require("../models");

const createLike = async (req, res) => {
  try {
    const { user_id, post_id, comment_id } = req.body || {};

    if (!user_id) {
      return res
        .status(400)
        .send({ result: 400, error: "user_id is required" });
    }

    if (!post_id && !comment_id) {
      return res.status(400).send({
        result: 400,
        error: "Either post_id or comment_id is required",
      });
    }

    if (post_id && comment_id) {
      return res.status(400).send({
        result: 400,
        error: "Only one of post_id or comment_id can be provided",
      });
    }

    const query = { user_id };
    if (post_id) query.post_id = post_id;
    if (comment_id) query.comment_id = comment_id;

    const existingLike = await Models.Like.findOne(query);

    if (existingLike) {
      return res.status(200).send({
        result: 200,
        message: "Already liked",
        data: existingLike,
      });
    }

    const likeData = {
      user_id,
      ...(post_id ? { post_id } : {}),
      ...(comment_id ? { comment_id } : {}),
    };

    // hard remove null/undefined keys
    Object.keys(likeData).forEach((key) => {
      if (likeData[key] === null || likeData[key] === undefined) {
        delete likeData[key];
      }
    });

    console.log("req.body =", req.body);
    console.log("likeData before save =", likeData);

    const savedLike = await Models.Like.create(likeData);

    return res.status(200).send({
      result: 200,
      message: "Like created successfully",
      data: savedLike,
    });
  } catch (err) {
    console.log("Create like error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

const removeLike = async (req, res) => {
  try {
    const { user_id, post_id, comment_id } = req.body || {};

    if (!user_id) {
      return res
        .status(400)
        .send({ result: 400, error: "user_id is required" });
    }

    if (!post_id && !comment_id) {
      return res.status(400).send({
        result: 400,
        error: "Either post_id or comment_id is required",
      });
    }

    const query = { user_id };
    if (post_id) query.post_id = post_id;
    if (comment_id) query.comment_id = comment_id;

    const data = await Models.Like.findOneAndDelete(query);

    return res.status(200).send({
      result: 200,
      message: data ? "Like removed successfully" : "Like already removed",
      data,
    });
  } catch (err) {
    console.log("Remove like error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

const getLikesByUser = async (req, res) => {
  try {
    const data = await Models.Like.find({ user_id: req.params.userId })
      .populate("post_id")
      .populate("comment_id");

    return res.status(200).send({ result: 200, data });
  } catch (err) {
    console.log("Get likes by user error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

const getLikesByPost = async (req, res) => {
  try {
    const data = await Models.Like.find({ post_id: req.params.postId });
    return res.status(200).send({ result: 200, data });
  } catch (err) {
    console.log("Get likes by post error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

const getLikesByComment = async (req, res) => {
  try {
    const data = await Models.Like.find({ comment_id: req.params.commentId });
    return res.status(200).send({ result: 200, data });
  } catch (err) {
    console.log("Get likes by comment error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

const getAllLikes = async (req, res) => {
  try {
    const data = await Models.Like.find({});
    return res.status(200).send({ result: 200, data });
  } catch (err) {
    console.log("Get all likes error:", err);
    return res.status(500).send({ result: 500, error: err.message });
  }
};

module.exports = {
  createLike,
  removeLike,
  getLikesByUser,
  getLikesByPost,
  getLikesByComment,
  getAllLikes,
};
