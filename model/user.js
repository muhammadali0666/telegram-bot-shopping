const mongoose = require("mongoose")

const User = new mongoose.Schema({
  name: String,
  chatId: Number,
  phone: String,
  admin: {
    type: Boolean,
    default: false
  },
  action: String,
  createdAt: Date,
  status: {
    type: Boolean,
    default: true
  }
})

const Users = mongoose.model("User", User)
module.exports = Users