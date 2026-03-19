import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product_models.js";
import { Order } from "../models/order_models.js";
import { Store } from "../models/store_models.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { storeId, productId, quantity } = req.body;

  if (quantity < 1) {
    throw new ApiError(400, "Invalid quantity");
  }
  if (!storeId || !productId || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.find({ _id: productId });

  if (!product[0]) {
    throw new ApiError(400, "Invalid Product Id");
  }

  if (product[0].ownerId == req.decodeToken._id) {
    throw new ApiError(400, "Owner can't place order to his product");
  }

  if (req.decodeToken._id == product.ownerId) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (quantity > product[0].stock) {
    throw new ApiError(400, "Quantity should be less than stock");
  }

  const order = await Order.create({
    storeId,
    userId: req.decodeToken._id,
    productId,
    quantity,
  });

  if (!order) {
    throw new ApiError(400, "Error while creating order");
  }

  product[0].stock -= quantity;

  await product[0].save();

  return res.json(new ApiResponse(200, "Successfully placed Order", { order }));
});

export const getOrder = asyncHandler(async (req, res) => {
  const { storeId, productId, orderId } = req.body;

  if (!storeId || !productId) {
    throw new ApiError(400, "All ids are required");
  }

  const query = { userId: req.decodeToken._id };

  if (orderId) {
    query._id = orderId;
  }

  const order = await Order.find(query);

  // if (!order[0]) {
  //   throw new ApiError(400, "order not found");
  // }

  return res.json(new ApiResponse(200, "got orders successfullly", { order }));
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId, quantity, status } = req.body;
  if (quantity < 1) {
    throw new ApiError(400, "quantity should be atleast one");
  }

  if (!orderId) {
    throw new ApiError(400, "order id is required");
  }

  if (!quantity && !status) {
    throw new ApiError(400, "At least one field is required for updating");
  }

  const order = await Order.find({ _id: orderId });
  if (!order[0]) {
    throw new ApiError(400, "order id is invalid");
  }
  if (status === "delivered") {
    order[0].deliveryTime =
      Date.now() / 1000 - new Date(order[0].createdAt) / 1000;
  }

  order[0].quantity = quantity ?? order[0].quantity;
  order[0].status = status ?? order[0].status;

  await order[0].save();

  return res.json(
    new ApiResponse(200, "Order updated successfully", { order: order[0] }),
  );
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order id is required");
  }

  const order = await Order.find({ _id: orderId });

  if (!order[0]) {
    throw new ApiError(400, "Order id is invalid");
  }

  if (order[0].userId != req.decodeToken._id) {
    throw new ApiError(401, "Unaouthorized request");
  }

  await order[0].deleteOne();

  return res.json(new ApiResponse(200, "Order deleted successfully"));
});
