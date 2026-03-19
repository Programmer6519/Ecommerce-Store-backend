import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product_models.js";
import { Review } from "../models/review_models.js";
import { Store } from "../models/store_models.js";
import { ApiError } from "../utils/ApiError.js";

export const createReview = asyncHandler(async (req, res) => {
  const { productId, content, rating } = req.body;

  if (!productId || !content || !rating) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.find({ _id: productId });

  if (!product[0]) {
    throw new ApiError(400, "Invalid product id");
  }

  if (req.decodeToken._id == product[0].ownerId) {
    throw new ApiError(400, "Owner can't write review to his products");
  }

  const review = await Review.create({
    productId,
    userId: req.decodeToken._id,
    content,
    rating,
  });

  if (!review) {
    throw new ApiError(400, "Error while creating review");
  }

  await product[0].save();
  const store = await Store.find({ _id: product[0].storeId });
  await store[0].save();

  return res.json(
    new ApiResponse(200, "Review created successfully", { review }),
  );
});

export const getReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product Id is required");
  }

  const product = await Product.find({ _id: productId });

  if (!product[0]) {
    throw new ApiError(400, "Product id is invalid");
  }
  const query = { productId };
  if (reviewId) {
    query._id = reviewId;
  }

  const reviews = await Review.find(query);

  return res.json(
    new ApiResponse(200, "Reviews got successfully", { reviews }),
  );
});

export const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId, content, rating } = req.body;

  if (!productId || !reviewId) {
    throw new ApiError(400, "All Ids are required");
  }

  if (!content && !rating) {
    throw new ApiError(400, "At least one field is required for update");
  }

  const product = await Product.find({ _id: productId });
  if (!product[0]) {
    throw new ApiError(400, "Invalid Product Id");
  }

  const review = await Review.find({ _id: reviewId, productId });
  if (!review[0]) {
    throw new ApiError(400, "Invalid review Id");
  }

  if (review[0].userId != req.decodeToken._id) {
    throw new ApiError(401, "Unauthorized Request");
  }

  review[0].content = content ?? review[0].content;
  review[0].rating = rating ?? review[0].rating;

  await product[0].save();
  const store = await Store.find({ _id: product[0].storeId });
  await store[0].save();

  await review[0].save();

  return res.json(
    new ApiResponse(200, "Review Updated successfully", { review }),
  );
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.body;

  if (!productId || !reviewId) {
    throw new ApiError(400, "All ids are required");
  }

  const product = await Product.find({ _id: productId });

  if (!product[0]) {
    throw new ApiError(400, "Invalid product id");
  }

  const review = await Review.find({ _id: reviewId, productId });
  if (!review[0]) {
    throw new ApiError(400, "Invalid review Id");
  }

  if (review[0].userId != req.decodeToken._id) {
    throw new ApiError(401, "Unauthorized Request");
  }

  await review[0].deleteOne();

  await product[0].save();
  const store = await Store.find({ _id: product[0].storeId });
  await store[0].save();

  return res.json(new ApiResponse(200, "Review deleted Successfully"));
});
