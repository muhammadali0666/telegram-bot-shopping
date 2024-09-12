const {Schema, model} = require("mongoose")

const Product = new Schema({
  title: String,
  price: Number,
  img: String,
  text: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  status: {
    type: Boolean,
    default: true
  }
})

const Products = model("Product", Product)
module.exports = Products