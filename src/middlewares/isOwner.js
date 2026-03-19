import { Store } from "../models/store_models.js";
import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isOwner = asyncHandler(async (req, res, next) => {
  const { storeId } = req.body;
  if (!storeId) {
    throw new ApiError(400, "Store id is required");
  }
  const store = await Store.find({ _id: storeId });
  if (!store[0]) {
    throw new ApiError(400, "Invalid store id");
  }

  // console.log(store[0].ownerId + " ------ " + req.decodeToken._id);

  if (store[0].ownerId != req.decodeToken._id) {
    throw new ApiError(400, "Unauthrozied Request");
  }
  req.isOwner = store[0].ownerId == req.decodeToken._id;

  next();
});
