import Router from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
} from "../controllers/order_controllers.js";
import { isOwner } from "../middlewares/isOwner.js";

const orderRouter = Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/get", isOwner, getOrder);
orderRouter.put("/update", updateOrder);
orderRouter.delete("/delete", deleteOrder);

export { orderRouter };
