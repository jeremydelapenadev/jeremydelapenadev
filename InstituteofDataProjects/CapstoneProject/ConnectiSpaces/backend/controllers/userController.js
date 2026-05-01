"use strict";
let Models = require("../models"); // matches index.js

const getUsers = (res) => {
  // finds all users
  Models.User.find({})
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

const createUser = (data, res) => {
  // creates a new user using JSON data POSTed in request body
  console.log(data);
  new Models.User(data)
    .save()
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

const updateUser = (req, res) => {
  // updates the user matching the ID from the param using JSON data POSTed in request body
  console.log(req.body);
  Models.User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

const deleteUser = (req, res) => {
  // deletes the user matching the ID from the param
  Models.User.findByIdAndDelete(req.params.id)
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

const addFavouriteSpace = (req, res) => {
  // adds a space to the user's favourites
  const { userId, spaceId } = req.params;

  Models.User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // checks if the space is already in favourites
      if (user.favourites.some((fav) => fav.toString() === spaceId)) {
        return res.status(400).send({
          error: "Space already exists in favourites",
        });
      }

      user.favourites.push(spaceId);

      user
        .save()
        .then((updatedUser) => {
          res.status(200).send({ data: updatedUser });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

const getFavouriteSpaces = (req, res) => {
  // gets all favourite spaces for a user
  const { userId } = req.params;

  Models.User.findById(userId)
    .populate("favourites")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      res.status(200).send({ data: user.favourites });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

const removeFavouriteSpace = (req, res) => {
  // removes a space from the user's favourites
  const { userId, spaceId } = req.params;

  Models.User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      user.favourites = user.favourites.filter(
        (fav) => fav.toString() !== spaceId
      );

      user
        .save()
        .then((updatedUser) => {
          res.status(200).send({ data: updatedUser });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  addFavouriteSpace,
  getFavouriteSpaces,
  removeFavouriteSpace,
};