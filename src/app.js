import { verifyJWT } from "./middlewares/auth_middleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { productRouter } from "./routes/product_routes.js";
import { reviewRouter } from "./routes/review_routes.js";
import { storeRouter } from "./routes/store_routes.js";
import { orderRouter } from "./routes/order_routes.js";
import { connectDB } from "./config/db.js";
import { adminRouter } from "./routes/admin_routes.js";
import { userRouter } from "./routes/user_routes.js";

import express from "express";

await connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public/temp"));

app.use("/api/v1/product", verifyJWT, productRouter);
app.use("/api/v1/review", verifyJWT, reviewRouter);
app.use("/api/v1/store", verifyJWT, storeRouter);
app.use("/api/v1/order", verifyJWT, orderRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.use(errorHandler);

export default app;
