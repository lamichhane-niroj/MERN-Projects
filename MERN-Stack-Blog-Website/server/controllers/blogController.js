import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subtitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Upload original image
    const uploadResponse = await imagekit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // Optimized image URL (1280px, webp, auto quality)
    const optimizedImageUrl = `${uploadResponse.url}?tr=w-1280,f-webp,q-auto`;

    // Cleanup local file
    fs.unlinkSync(imageFile.path);

    await Blog.create({
      title,
      subtitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ sucess: true, blogs });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.json({ sucess: false, message: "Blog not found" });
    }

    res.json({ sucess: true, blog });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByIdAndDelete(blogId);

    // delete all comments associated with the blog
    await Comment.deleteMany({blog: id});

    res.json({ sucess: true, message: "Blog deleted successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ sucess: true, message: "Blog status updated" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
