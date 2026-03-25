import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_models.js";
import bcrypt from "bcrypt";
import { Order } from "../models/order_models.js";
import { Review } from "../models/review_models.js";
import { emailService } from "../services/email_service.js";

const verifiedEmails = [];
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
      emailService.sendOtp(email, otp);
      otps[i].requestTimeLimit = Date.now() / 1000 + 300;

      break;
    }
    if (otps[i].email === email) {
      isEmailFound = true;
      otps[i].count++;
      otps[i].otp = otp;
      otps[i].expTime = expTime;
      emailService.sendOtp(email, otp);

      break;
    }
  }

  if (!isEmailFound) {
    otps.push({ email, otp, expTime, count: 1 });
    emailService.sendOtp(email, otp);
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
  verifiedEmails.push({ email });
  return res.json(new ApiResponse(200, "Email verified successfully"));
});

export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;

  isEmailValid(email);
  if (!name || !password || !address) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password should be 8 character long");
  }

  // let isUserVerified = false;
  // for (let i = 0; i < verifiedEmails.length; i++) {
  //   if (verifiedEmails[i].email === email) {
  //     isUserVerified = true;
  //     break;
  //   }
  // }

  // if (!isUserVerified) {
  //   throw new ApiError(
  //     400,
  //     "Email is not verified , go and verify email first"
  //   );
  // }

  const userExists = await User.find({ email: email });

  if (userExists[0]) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    address,
  });
  if (!user) {
    throw new ApiError(400, "Error in creating user");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const resUser = user.toObject();
  delete resUser.password;
  delete resUser.refreshToken;

  return res.json(
    new ApiResponse(200, "User created successfully", {
      user: resUser,
      accessToken,
      refreshToken,
    })
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  isEmailValid(email);
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const user = await User.find({ email });
  if (!user[0]) {
    throw new ApiError(400, "User don't exist");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  const accessToken = await user[0].generateAccessToken();
  const refreshToken = await user[0].generateRefreshToken();

  user[0].refreshToken = refreshToken;

  await user[0].save({ validateBeforeSave: false });
  const resUser = user[0].toObject();

  delete resUser.refreshToken;
  delete resUser.password;

  return res.json(
    new ApiResponse(200, "User logged In successfully", {
      user: resUser,
      accessToken,
      refreshToken,
    })
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { previousPassword, newPassword, confirmPassword } = req.body;
  if (!previousPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required!");
  }

  const user = await User.find({ _id: req.decodeToken._id });

  const isPasswordCorrect = await bcrypt.compare(
    previousPassword,
    user[0].password
  );
  if (newPassword.length < 8) {
    throw new ApiError(400, "Password should be 8 character long");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New passwords don't match");
  }

  if (newPassword === previousPassword) {
    throw new ApiError(400, "New password should be different than previous");
  }

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  user[0].password = await bcrypt.hash(newPassword, 10);
  await user[0].save({ validateBeforeSave: false });
  const resUser = user[0].toObject();

  delete resUser.refreshToken;
  delete resUser.password;

  emailService.passwordChanged(user[0].email, user[0].name);

  return res.json(
    new ApiResponse(200, "Password Changed successfully", { user: resUser })
  );
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.decodeToken._id });

  return res.json(
    new ApiResponse(200, "Successfully got all orders", { orders })
  );
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ userId: req.decodeToken._id });

  return res.json(
    new ApiResponse(200, "Successfully got all reviews", { reviews })
  );
});
