import { DataTypes } from "sequelize";
import { sequelize } from "../db.connection.js";
import { UserModel } from "./user.model.js";

export const BlogModel = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "B_title",
      validate: {
        notEmpty: { msg: "Title Must not be empty" },
        len: { msg: "min Length is 5 and max Length is 250", args: [5, 250] },
      },
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      field: "B_content",
      validate: {
        notEmpty: { msg: "Content Must not be empty" },
        len: { msg: "min Length is 5 and max Length is 1000", args: [5, 1000] },
      },
    },
  },
  {
    createdAt: "B_createdAt",
    updatedAt: "B_updatedAt",
    paranoid: true,
  }
);

BlogModel.belongsTo(UserModel, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: {
    name: "B_author_id",
    allowNull: false,
  },
});

UserModel.hasMany(BlogModel, {
  foreignKey: {
    name: "B_author_id",
    allowNull: false,
  },
});
