import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import connectDB from "./DB/db.connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";

dotenv.config({
  path: path.join("./src/config/.env"),
});

export const connection = connectDB();

const bootstrap = async () => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to BlogWave App ❤️" });
  });

  app.use("/auth", authRouter);
  app.use("/users", userRouter);

  app.all("{/*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Page No Found ❌" });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({ err_message: err.message, stack: err.stack, err });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} 🚀`);
  });
};

export default bootstrap;
