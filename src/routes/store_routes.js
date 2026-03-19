import Router from "express";
import {
  createStore,
  deleteStore,
  getStore,
  updateStore,
} from "../controllers/store_controllers.js";
import { isOwner } from "../middlewares/isOwner.js";

const storeRouter = Router();

storeRouter.get("/get", getStore);
storeRouter.post("/create", createStore);
storeRouter.put("/update", isOwner, updateStore);
storeRouter.delete("/delete", isOwner, deleteStore);

export { storeRouter };
