import express from "express";
import * as userController from "./user.controller.js";
const router = express.Router();

router.get("/search", userController.searchUser);
router.get("/:id", userController.getUserProfile);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
