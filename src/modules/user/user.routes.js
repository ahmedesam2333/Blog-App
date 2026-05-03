import express from "express";
import * as userController from "./user.controller.js";
const router = express.Router();

router.get("/search", userController.searchUser);
router.get("/:id", userController.getUserProfile);
router.patch("/:id", userController.updateUser);
router.patch("/:id/restore", userController.restoreUser);
router.delete("/truncate", userController.truncateTable);
router.delete("/:id/freeze", userController.freezeUser);
router.delete("/:id/hard", userController.hardDeleteUser);

export default router;
