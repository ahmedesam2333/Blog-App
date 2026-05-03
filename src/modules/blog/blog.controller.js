import { UserModel } from "../../DB/models/user.model.js";
import { BlogModel } from "../../DB/models/blog.model.js";
import { successResponse, errorHandling } from "../../utils/response.js";
import { Op } from "sequelize";

export const createBlog = async (req, res, next) => {
  try {
    const { title, content, author_id } = req.body;
    if (!title || !content || !author_id)
      return res.status(400).json({ message: "Invalid Data" });
    const user = await UserModel.findByPk(author_id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    const blog = await BlogModel.create({
      title,
      content,
      B_author_id: author_id,
    });
    return successResponse({
      res,
      status: 201,
      message: "Blog Created Successfully",
      data: blog,
    });
  } catch (error) {
    return errorHandling({ res, error });
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid Data" });
    const blog = await BlogModel.findByPk(id, {
      include: [{ model: UserModel, attributes: { exclude: "password" } }],
    });
    if (!blog) return res.status(404).json({ message: "Blog Not Found" });
    return successResponse({
      res,
      data: blog,
    });
  } catch (error) {
    return errorHandling({ res, error });
  }
};

export const searchBlogs = async (req, res, next) => {
  try {
    const { search, page, size } = req.query;
    if (!search || !page || !size)
      return res.status(400).json({ message: "Please add required fields" });
    const currentPage = parseInt(page < 1 ? 1 : page);
    const blogs = await BlogModel.findAndCountAll({
      where: { title: { [Op.substring]: search } },
      offset: parseInt((currentPage - 1) * size),
      limit: parseInt(size < 1 ? 5 : size),
      include: [
        {
          model: UserModel,
          attributes: { exclude: "password" },
        },
      ],
    });
    if (!blogs.rows.length)
      return res.status(404).json({ message: "No Blogs Found" });
    return res.status(200).json({
      message: "Done",
      pageSize: size,
      pages: Math.ceil(blogs.count / size),
      blogs,
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const freezeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please Add ID" });
    const blog = await BlogModel.destroy({
      where: { id: id },
    });
    if (!blog) return res.status(404).json({ message: "No Blog Found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const restoreBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please Add ID" });
    const blog = await BlogModel.restore({
      where: { id: id },
    });
    if (!blog) return res.status(404).json({ message: "No Blog Found" });
    return successResponse({
      res,
      message: "Blog restored successfully",
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};
