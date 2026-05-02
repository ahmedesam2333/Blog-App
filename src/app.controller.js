import express from "express";
import { checkDBConnection, syncDB } from "./DB/db.connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import blogRouter from "./modules/blog/blog.routes.js";

const bootstrap = async () => {
  const app = express();

  //DB
  await checkDBConnection();
  await syncDB();

  app.use(express.json());

  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to BlogWave App ❤️" });
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/blog", blogRouter);

  app.all("{/*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Page No Found ❌" });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({ err_message: err.message, stack: err.stack, err });
  });

  return app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} 🚀`);
  });
};

export default bootstrap;
