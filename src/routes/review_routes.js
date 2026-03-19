import Router from "express";
import {
  createReview,
  deleteReview,
  getReview,
  updateReview,
} from "../controllers/review_controllers.js";
import { isOwner } from "../middlewares/isOwner.js";

const reviewRouter = Router();

reviewRouter.post("/create", createReview);
reviewRouter.get("/get", getReview);
reviewRouter.put("/update", updateReview);
reviewRouter.delete("/delete", deleteReview);

export { reviewRouter };
