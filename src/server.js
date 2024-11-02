const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Morgan enabled...");
}

// Load environment variables
dotenv.config({
  path: "./config.env",
});


// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log(`Connected to MongoDB: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  });


// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
