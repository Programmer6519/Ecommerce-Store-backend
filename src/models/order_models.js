import { mongoose, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "inProcess",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    deliveryTime: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
