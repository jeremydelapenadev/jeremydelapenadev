let express = require("express");
let router = express.Router();

let Controllers = require("../controllers");

router.get("/", (req, res) => {
  Controllers.spaceController.getSpaces(res);
});

router.get("/:id", (req, res) => {
  Controllers.spaceController.getSpaceById(req, res);
});

router.post("/create", (req, res) => {
  Controllers.spaceController.createSpace(req.body, res);
});

router.put("/:id", (req, res) => {
  Controllers.spaceController.updateSpace(req, res);
});

router.delete("/:id", (req, res) => {
  Controllers.spaceController.deleteSpace(req, res);
});

module.exports = router;