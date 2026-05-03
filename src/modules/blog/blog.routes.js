import express from "express";
import * as blogController from "./blog.controller.js";
const router = express.Router();

router.post("/", blogController.createBlog);
router.get("/search", blogController.searchBlogs);
router.get("/:id", blogController.getBlog);
router.delete("/:id/freeze", blogController.freezeBlog);
router.patch("/:id/restore", blogController.restoreBlog);

export default router;
