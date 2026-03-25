import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
import { connectDB } from "./config/db.js";

connectDB().then(() =>
  app.listen(process.env.PORT, () => {
    console.log(`Server is listeneing to port ${process.env.PORT}`);
  })
);
