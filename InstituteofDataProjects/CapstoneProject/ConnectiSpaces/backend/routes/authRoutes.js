const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/test", (req, res) => {
  res.json({ message: "Auth route works" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("LOGIN ROUTE HIT");
    console.log("Request body:", req.body);

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password_hash !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;