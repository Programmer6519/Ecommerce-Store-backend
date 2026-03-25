import { mongoose, Schema } from "mongoose";
import { Product } from "./product_models.js";
import { Order } from "./order_models.js";

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      default: null,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    category: {
      type: Map,
      of: Number,
      default: {},
    },
    deliveryTime: {
      type: Number,
      default: 0,
    },
    deliveredOrders: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

storeSchema.pre("save", async function () {
  const products = await Product.find({ storeId: this._id });
  let avgRating = 0,
    totalReviews = 0,
    productsCount = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].rating) {
      productsCount++;
      avgRating += products[i].rating;
      totalReviews += products[i].numberOfReviews;
    }
  }
  avgRating /= productsCount;
  this.rating = avgRating;
  this.totalProducts = products.length;
  // const orders = await Order.l
  const orders = await Order.countDocuments({ storeId: this._id });
  this.totalSales = await orders.length;
  this.reviewCount = totalReviews.toFixed(3);
});

export const Store = mongoose.model("Store", storeSchema);
