import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    food: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 2,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model("Order", orderSchema);
