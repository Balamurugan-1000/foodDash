import { model, Schema } from "mongoose";

const dishSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  description: {
    required: true,
    type: String,
  },
  count: {
    required: true,
    type: Number,
  },
});

export default model("Dish", dishSchema);
