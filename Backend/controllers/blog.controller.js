import asyncHandler from "express-async-handler";
import Blog from "../models/blog.model.js";

// @desc  Admin: publish a new blog post
// @route POST /api/blogs
// @access Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("title and content are required");
    }

    const blog = await Blog.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: blog });
});

// @desc  Get every blog post, most recent first
// @route GET /api/blogs
// @access Public
export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
});

// @desc  Get a single blog post
// @route GET /api/blogs/:id
// @access Public
export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    res.json({ success: true, data: blog });
});

// @desc  Admin: edit a blog post
// @route PUT /api/blogs/:id
// @access Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    res.json({ success: true, data: blog });
});

// @desc  Admin: delete a blog post
// @route DELETE /api/blogs/:id
// @access Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    res.json({ success: true, message: "Blog post deleted" });
});
