import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product_models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user_models.js";
import { Store } from "../models/store_models.js";
import { Order } from "../models/order_models.js";

export const createStore = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const store = await Store.create({
    name,
    ownerId: req.decodeToken._id,
  });

  const user = await User.find({ _id: req.decodeToken._id });
  user[0].role = "seller";

  await user[0].save({ validateBeforeSave: false });

  if (!store) {
    throw new ApiError(400, "Error in creating Store");
  }
  return res.json(
    new ApiResponse(200, "Store created successfully", { store })
  );
});

export const getStore = asyncHandler(async (req, res) => {
  const { storeId, page, limit } = req.body;
  const query = {};

  if (!storeId && (page < 0 || !page || limit < 0 || !limit)) {
    throw new ApiError(400, "page and limit is required");
  }

  if (storeId) {
    query._id = storeId;
  }

  const store = await Store.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  if (storeId && !store[0]) {
    throw new ApiError(400, "Store id is invalid");
  }
  return res.json(
    new ApiResponse(200, "successfully got store", { stores: store })
  );
});

export const updateStore = asyncHandler(async (req, res) => {
  const { storeId, newName } = req.body;

  if (!storeId || !newName) {
    throw new ApiError(400, "All fields are required");
  }

  const store = await Store.find({ _id: storeId });
  if (!store[0]) {
    throw new ApiError(400, "Store Id is invalid");
  }

  store[0].name = newName;

  await store[0].save();
  res.json(
    new ApiResponse(200, "Store updated successfully", { store: store[0] })
  );
});

export const deleteStore = asyncHandler(async (req, res) => {
  const { storeId } = req.body;

  const store = await Store.find({
    _id: storeId,
    ownerId: req.decodeToken._id,
  });
  if (!store[0]) {
    throw new ApiError(400, "Invalid store Id");
  }

  const orders = await Order.find({ storeId: storeId });

  if (orders[0]) {
    throw new ApiError(400, "there are orders available for this store");
  }
  const products = await Product.find({ storeId });

  for (let i = 0; i < products.length; i++) {
    await products[i].deleteOne();
  }
  await store[0].deleteOne();
  return res.json(new ApiResponse(200, "Store deleted successfully"));
});
