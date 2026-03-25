import Router from "express";
import { verifyJWT } from "../middlewares/auth_middleware.js";

import {
  changePassword,
  getMyOrders,
  getMyReviews,
  loginUser,
  sendOtp,
  signupUser,
  verifyOtp,
} from "../controllers/user_controllers.js";

const userRouter = Router();

userRouter.post("/send_otp", sendOtp);
userRouter.post("/verify_otp", verifyOtp);
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/change_password", verifyJWT, changePassword);
userRouter.get("/get_orders", verifyJWT, getMyOrders);
userRouter.get("/get_reviews", verifyJWT, getMyReviews);

export { userRouter };
