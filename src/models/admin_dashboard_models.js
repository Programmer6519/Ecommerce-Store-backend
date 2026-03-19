import { mongoose, Schema } from "mongoose";

const dashboardSchema = new Schema(
  {
    totalUser: {
      type: Number,
      default: 0,
    },
    totalSeller: {
      type: Number,
      default: 0,
    },
    totalOrder: {
      type: Number,
      default: 0,
    },
    totalReview: {
      type: Number,
      default: 0,
    },
    totalBuyer: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
