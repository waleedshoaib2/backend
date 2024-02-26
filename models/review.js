import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
