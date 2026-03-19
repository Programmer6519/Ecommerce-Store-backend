import { mongoose, Schema } from "mongoose";

const singleSellerStoreSchema = new Schema(
  {
    buyers: {
      type: Number,
      default: 0,
    },
    product: {
      type: Number,
      default: 0,
    },
    review: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },
    avgDelivery: {
      type: Number,
      default: 0,
    },
    returns: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const SingleSeller = mongoose.model(
  "SingleSeller",
  singleSellerStoreSchema,
);
