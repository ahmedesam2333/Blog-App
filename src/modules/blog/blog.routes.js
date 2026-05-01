import express from "express";
import * as blogController from "./blog.controller.js";
const router = express.Router();

router.post("/", blogController.createBlog);
router.get("/user/:id", blogController.getUserBlogs);

export default router;
