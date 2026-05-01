let express = require("express");
let router = express.Router();

let Controllers = require("../controllers"); // index.js

// Adds a GET route to return all users
router.get("/", (req, res) => {
  Controllers.userController.getUsers(res);
});
// Adds a POST route to create a new user
router.post("/create", (req, res) => {
  Controllers.userController.createUser(req.body, res);
});

router.put("/:id", (req, res) => {
  Controllers.userController.updateUser(req, res);
})

router.delete ("/:id", (req, res) => {
  Controllers.userController.deleteUser(req, res);
})

router.post("/:userId/favourites/:spaceId", (req, res) => {
  Controllers.userController.addFavouriteSpace(req, res);
});

router.get("/:userId/favourites", (req, res) => {
  Controllers.userController.getFavouriteSpaces(req, res);
});

router.delete("/:userId/favourites/:spaceId", (req, res) => {
  Controllers.userController.removeFavouriteSpace(req, res);
});

module.exports = router;