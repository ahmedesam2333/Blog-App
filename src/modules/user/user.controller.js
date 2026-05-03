import { BlogModel } from "../../DB/models/blog.model.js";
import { UserModel } from "../../DB/models/user.model.js";
import { successResponse, errorHandling } from "../../utils/response.js";
import { Op } from "sequelize";

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: BlogModel,
          attributes: ["content", "title"],
        },
      ],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, data: user });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const { search, page, size } = req.query;
    if (!search || !page || !size)
      return res.status(400).json({ message: "Please add required fields" });
    const currentPage = parseInt(page < 1 ? 1 : page);
    const users = await UserModel.findAndCountAll({
      where: { firstName: { [Op.substring]: search } },
      offset: parseInt((currentPage - 1) * size),
      limit: parseInt(size < 1 ? 5 : size),
    });
    return res.status(200).json({
      message: "Done",
      pageSize: size,
      pages: Math.ceil(users.count / size),
      users,
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.update(req.body, {
      where: { id },
    });
    console.log(user);
    return user[0]
      ? successResponse({ res, message: "User Updated" })
      : res.status(400).json({ message: "Failed to Update" });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.restore({
      where: { id },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, message: "User restored", status: 200 });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const truncateTable = async (req, res, next) => {
  try {
    const table = await tableModel.destroy({
      truncate: true,
    });
    if (!user) return res.status(404).json({ message: "Table is empty" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const freezeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.destroy({
      where: { id },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};

export const hardDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.destroy({
      where: { id },
      force: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};
