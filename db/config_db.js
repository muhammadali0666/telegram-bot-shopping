const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function mongoConnection() {
  try {
    mongoose
      .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDb connected"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = mongoConnection;
