import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from "../controllers/blog.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getAllBlogs)
    .post(protect, admin, createBlog);

router.route("/:id")
    .get(getBlogById)
    .put(protect, admin, updateBlog)
    .delete(protect, admin, deleteBlog);

export default router;
