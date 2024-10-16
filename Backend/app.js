require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./controller/user.controller"); // Assuming this is where your user routes are
const port = process.env.PORT || 7070;
const app = express();
const cors = require("cors"); // Add this line to import cors
const path = require("path");
// Serve static files from the "frontend" directory (or your preferred directory)
app.use(express.static(path.join(__dirname, "frontend")));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(cors()); // Enable CORS for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const DbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/loginandsignup");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

DbConnect();

// Use user routes
app.use("/api", userRouter);
app.get("/", (_, res) => {
  res.status(200).send("Server is running");
}); // Mount the user router on /api

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//practice
