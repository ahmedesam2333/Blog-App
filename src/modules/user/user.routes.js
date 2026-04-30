import express from "express";
import * as userController from "./user.controller.js";
const router = express.Router();

router.get("/", userController.getAllUsers);

export default router;
