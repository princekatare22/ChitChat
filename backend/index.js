const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.Moongoose_URL)
  .then(function () {
    console.log("Connected to Database Successfully !!");
  })
  .catch(function () {
    console.log("Some Errror Connecting Database!!");
  });

app.listen(process.env.PORT, function () {
  console.log(`Server Running on PORT ${process.env.PORT}`);
});
