const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Morgan enabled...");
}

dotenv.config({
  path: "./config.env",
});

mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log(`Connected to MongoDB: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
