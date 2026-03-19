import Router from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controllers/product_controllers.js";
import { isOwner } from "../middlewares/isOwner.js";

const productRouter = Router();

productRouter.get("/get", getProduct);
productRouter.post("/create", isOwner, createProduct);
productRouter.put("/update", isOwner, updateProduct);
productRouter.delete("/delete", deleteProduct);

export { productRouter };
