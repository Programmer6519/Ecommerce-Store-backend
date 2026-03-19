import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.log(error);
  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
