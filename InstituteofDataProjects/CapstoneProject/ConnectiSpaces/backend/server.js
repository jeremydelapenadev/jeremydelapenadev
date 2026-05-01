const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

require("./dbConnect"); // MUST come before routes

// Enable CORS for all routes
app.use(cors());

// Import the routes
let userRoutes = require("./routes/userRoutes");
let postRoutes = require("./routes/postRoutes");
let commentRoutes = require("./routes/commentRoutes");
let likeRoutes = require("./routes/likeRoutes");
let spaceRoutes = require("./routes/spaceRoutes");
let authRoutes = require("./routes/authRoutes");
let reviewRoutes = require("./routes/reviewRoutes");

// Middleware to parse JSON / parse requests of content-type - application/json
app.use(express.json());

// Mount the routes with API prefixes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my MongoDB application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
