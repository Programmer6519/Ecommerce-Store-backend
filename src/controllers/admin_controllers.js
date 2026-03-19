import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review_models.js";
import { Admin } from "../models/admin_models.js";
import { Order } from "../models/order_models.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_models.js";
import { Store } from "../models/store_models.js";
import { Product } from "../models/product_models.js";
import bcrypt from "bcrypt";

const verifiedAdmins = [];
const otps = [];

const isEmailValid = (email) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  let emailWithoutSpaces = email.replace(" ", "");

  if (emailWithoutSpaces != email) {
    throw new ApiError(400, "No spaces allowed in email");
  }

  if (!email.includes("@") || !email.includes(".com" || email[0] == "@")) {
    throw new ApiError(400, "Email is invalid");
  }
};

const verifyEmail = (email, arr) => {
  for (let i = 1; i <= arr.length; i++) {
    if (arr[i - 1].email === email && arr[i - 1].expTime > Date.now() / 1000) {
      return i;
    }
  }
  return false;
};

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  isEmailValid(email);

  const otp = Math.floor(Math.random() * 9000 + 1000);
  const expTime = Date.now() / 1000 + 120;

  let isEmailFound = false;
  for (let i = 0; i < otps.length; i++) {
    if (
      otps[i].email === email &&
      otps[i].count > 2 &&
      otps[i].requestTimeLimit > Date.now() / 1000
    ) {
      throw new ApiError(400, "Otps limit reached and try again later");
    }
    if (
      otps[i].email === email &&
      otps[i].count > 2 &&
      otps[i].requestTimeLimit < Date.now() / 1000
    ) {
      otps[i].count = 0;
    }

    if (otps[i].email === email && otps[i].count === 2) {
      isEmailFound = true;
      otps[i].count++;
      otps[i].otp = otp;
      otps[i].expTime = expTime;
      otps[i].requestTimeLimit = Date.now() / 1000 + 300;
      break;
    }
    if (otps[i].email === email) {
      isEmailFound = true;
      otps[i].count++;
      otps[i].otp = otp;
      otps[i].expTime = expTime;
      break;
    }
  }

  if (!isEmailFound) {
    otps.push({ email, otp, expTime, count: 1 });
  }

  return res
    .status(200)
    .json({ success: true, message: "Otp sent successfully", otp });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  isEmailValid(email);

  let isVerified = verifyEmail(email, otps);
  if (!isVerified) {
    throw new ApiError(400, "Otp is expired or invalid");
  }

  if (otps[isVerified - 1].otp !== otp) {
    throw new ApiError(400, "Invalid Otp");
  }
  verifiedAdmins.push({ email });
  return res.json(new ApiResponse(200, "Email verified successfully"));
});

export const signupAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  isEmailValid(email);
  if (!name || !password) {
    throw new ApiError(400, "All fields are required");
  }
  // let isAdminVerified = false;
  // for (let i = 0; i < verifiedAdmins.length; i++) {
  //   if (verifiedAdmins[i].email === email) {
  //     isAdminVerified = true;
  //     break;
  //   }
  // }
  // if (isAdminVerified) {
  //   throw new ApiError(
  //     400,
  //     "Email is not verified , go and verify email first",
  //   );
  // }

  const adminExists = await Admin.find({ email: email });
  const userExists = await User.find({ email: email });

  if (adminExists[0] || userExists[0]) {
    throw new ApiError(400, "User or admin already exist");
  }
  const admin = await Admin.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  if (!admin) {
    throw new ApiError(400, "Error in creating user");
  }

  const accessToken = await admin.generateAccessToken();
  const refreshToken = await admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  const resAdmin = admin.toObject();
  delete resAdmin.password;
  delete resAdmin.refreshToken;

  return res.json(
    new ApiResponse(200, "Admin created successfully", {
      resAdmin,
      accessToken,
      refreshToken,
    }),
  );
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  isEmailValid(email);
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const admin = await Admin.find({ email });

  if (!admin[0]) {
    throw new ApiError(400, "admin don't exist");
  }
  const isPasswordCorrect = await bcrypt.compare(password, admin[0].password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  const accessToken = await admin[0].generateAccessToken();
  const refreshToken = await admin[0].generateRefreshToken();

  admin[0].refreshToken = refreshToken;
  await admin[0].save({ validateBeforeSave: false });
  const resAdmin = admin[0].toObject();

  delete resAdmin.refreshToken;
  delete resAdmin.password;

  return res.json(
    new ApiResponse(200, "admin logged In successfully", {
      resAdmin,
      accessToken,
      refreshToken,
    }),
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { previousPassword, newPassword, confirmPassword } = req.body;
  if (!previousPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required!");
  }
  const admin = await Admin.find({ _id: req.decodeToken._id });

  const isPasswordCorrect = await bcrypt.compare(
    previousPassword,
    admin[0].password,
  );
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New passwords don't match");
  }

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  admin[0].password = await bcrypt.hash(newPassword, 10);
  await admin[0].save({ validateBeforeSave: false });
  const resAdmin = admin[0].toObject();

  delete resAdmin.refreshToken;
  delete resAdmin.password;
  return res.json(
    new ApiResponse(200, "Password Changed successfully", { resAdmin }),
  );
});

export const adminDashboard = asyncHandler(async (req, res) => {
  const user = await User.countDocuments({});
  const buyer = await User.countDocuments({ role: "buyer" });
  const seller = await User.countDocuments({ role: "seller" });
  const order = await Order.countDocuments({});
  const review = await Review.countDocuments({});

  return res.json(
    new ApiResponse(200, "Successfully got all the details", {
      totalUser: user,
      totalBuyer: buyer,
      totalSeller: seller,
      totalOrders: order,
      totalReview: review,
    }),
  );
});

export const singleSellerStats = asyncHandler(async (req, res) => {
  const { storeId } = req.body;

  const store = await Store.find({ _id: storeId });
  if (!store[0]) {
    throw new ApiError(400, "Invalid Store Id");
  }
  const product = await Product.countDocuments({ storeId });
  const buyer = await Order.distinct("userId", { storeId }).length;
  const reviewCount = store[0].reviewCount;
  const rating = store[0].rating;
  const deliveredOrders = await Order.find({ storeId, status: "delivered" });
  let avgTime = 0;
  for (let i = 0; i < deliveredOrders.length; i++) {
    avgTime += deliveredOrders[i].deliveryTime;
  }
  avgTime /= deliveredOrders.length;
  const returns = await Order.countDocuments({ storeId, status: "refunded" });

  return res.json(
    new ApiResponse(200, "successfully got stats", {
      totalBuyers: buyer,
      totalProducts: product,
      totalReviews: reviewCount,
      rating,
      avgDeliveryTime: avgTime,
      totalReturns: returns,
    }),
  );
});

export const adminUserList = asyncHandler(async (req, res) => {
  const { pageNumber } = req.body;

  const users = await User.find({})
    .skip((pageNumber - 1) * 10)
    .limit(10);

  return res.json(new ApiResponse(200, "Successfully got users", { users }));
});

export const adminByuerList = asyncHandler(async (req, res) => {
  const { pageNumber } = req.body;

  const buyers = await User.find({ role: "buyer" })
    .skip((pageNumber - 1) * 10)
    .limit(10);

  return res.json(new ApiResponse(200, "Successfully got buyers", { buyers }));
});

export const adminSellerList = asyncHandler(async (req, res) => {
  const { pageNumber } = req.body;

  const sellers = await User.find({ role: "seller" })
    .skip((pageNumber - 1) * 10)
    .limit(10);

  return res.json(
    new ApiResponse(200, "Successfully got sellers", { sellers }),
  );
});

export const adminOrderList = asyncHandler(async (req, res) => {
  const { pageNumber } = req.body;

  const orders = await Order.find({})
    .skip((pageNumber - 1) * 10)
    .limit(10);

  return res.json(new ApiResponse(200, "Successfully got orders", { orders }));
});
