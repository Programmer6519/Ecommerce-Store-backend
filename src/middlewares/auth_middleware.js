import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.header("Authorization");
  if (!accessToken) {
    throw new ApiError(400, "Invalid access Token");
  }
  try {
    const decodeToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    const user = await User.find({ _id: decodeToken._id });
    if (!user[0]) {
      throw new ApiError(400, "User don't exist");
    }
    req.decodeToken = decodeToken;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      throw new ApiError(401, "Token is expired");
    }
    throw new ApiError(500, "Error during jwt verifification");
  }
});
