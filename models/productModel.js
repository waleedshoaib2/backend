import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },

  material: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
