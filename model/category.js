const mongoose = require("mongoose")

const Category = new mongoose.Schema({
  title: String,
  status: {
    type: Boolean,
    default: true
  }
})

const Categories = mongoose.model("Category", Category)
module.exports = Categories