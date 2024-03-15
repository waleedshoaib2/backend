import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number ,
    required: true,
  },
});

export default mongoose.model("Review", reviewSchema);
