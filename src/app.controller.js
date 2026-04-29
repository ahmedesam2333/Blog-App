import express from "express";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({
  path: path.join("./src/config/.env"),
});
const bootstrap = async () => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to BlogWave App ❤️" });
  });

  app.all("{/*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Page No Found ❌" });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} 🚀`);
  });
};

export default bootstrap;
