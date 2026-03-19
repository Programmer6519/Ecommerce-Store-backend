import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product_models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Store } from "../models/store_models.js";
import { ApiError } from "../utils/ApiError.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { storeId, name, stock, price, content, category } = req.body;

  if (!storeId || !name || !stock || !price || !content || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const store = await Store.find({ _id: storeId });
  if (!store[0]) {
    throw new ApiError(400, "Invalid Store id");
  }

  const current = store[0].category.get(category) || 0;
  // console.log(current);
  store[0].category.set(category, current + 1);
  await store[0].save();

  const product = await Product.create({
    storeId,
    ownerId: req.decodeToken._id,
    name,
    category,
    stock,
    price,
    content,
  });

  if (!product) {
    throw new ApiError(400, "Error while creating product");
  }

  return res.json(
    new ApiResponse(200, "Successfully created Product", { product: product }),
  );
});

export const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const query = {};

  if (productId) {
    query._id = productId;
  }

  const product = await Product.find(query);

  return res.json(
    new ApiResponse(200, "successfully got product", { product }),
  );
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { storeId, productId, name, stock, price, content } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  if (!name && !stock && !price && !content) {
    throw new ApiError(400, "At least one field is required for update");
  }

  const product = await Product.find({ _id: productId, storeId });

  if (!product[0]) {
    throw new ApiError(400, "Invalid product id");
  }

  product[0].name = name ?? product[0].name;
  product[0].stock = stock ?? product[0].stock;
  product[0].price = price ?? product[0].price;
  product[0].content = content ?? product[0].content;

  await product[0].save();

  return res.json(
    new ApiResponse(200, "Product updated successfully", {
      product: product[0],
    }),
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await Product.find({ _id: productId });

  if (!product[0]) {
    throw new ApiError(400, "Invalid Product Id");
  }
  if (req.decodeToken._id != product[0].ownerId) {
    throw new ApiError(400, "Unauthorized request");
  }
  await product[0].deleteOne();
  return res.json(new ApiResponse(200, "Product deleted successfully"));
});
