import mongoose, { Schema } from "mongoose";
import { Review } from "./review_models.js";
import { Store } from "./store_models.js";

const productSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

productSchema.pre("save", async function () {
  const reviews = await Review.find({ productId: this._id });
  this.numberOfReviews = reviews.length;
  let avgRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    avgRating += reviews[i].rating;
  }
  avgRating /= reviews.length;
  this.rating = avgRating.toFixed(1);
});

export const Product = mongoose.model("Product", productSchema);
