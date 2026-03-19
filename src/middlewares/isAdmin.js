import { Admin } from "../models/admin_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const accessToken = req.header("Authorization");
  let adminExists = true;

  try {
    const decodeToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    const admin = await Admin.find({ _id: decodeToken._id });
    if (!admin[0]) {
      throw new ApiError(400, "Unauthorized request");
    }
    req.decodeToken = decodeToken;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      throw new ApiError(401, "Token is expired");
    }
    if (error instanceof ApiError) {
      throw new ApiError(400, "Unauthorized request");
    }

    throw new ApiError(500, "Error during jwt verifification");
  }
});
