import { verifyAdmin } from "../middlewares/isAdmin.js";
import {
  adminByuerList,
  adminDashboard,
  adminOrderList,
  adminSellerList,
  adminUserList,
  changePassword,
  loginAdmin,
  signupAdmin,
  singleSellerStats,
} from "../controllers/admin_controllers.js";
import Router from "express";

const adminRouter = Router();

adminRouter.get("/single_seller_stats", verifyAdmin, singleSellerStats);
adminRouter.post("/change_password", verifyAdmin, changePassword);
adminRouter.get("/admin_sellers", verifyAdmin, adminSellerList);
adminRouter.get("/admin_buyers", verifyAdmin, adminByuerList);
adminRouter.get("/admin_orders", verifyAdmin, adminOrderList);
adminRouter.get("/admin_users", verifyAdmin, adminUserList);
adminRouter.get("/dashboard", verifyAdmin, adminDashboard);
adminRouter.post("/signup", signupAdmin);
adminRouter.post("/login", loginAdmin);

export { adminRouter };
