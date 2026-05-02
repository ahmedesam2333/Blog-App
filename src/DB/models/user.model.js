import { sequelize } from "../db.connection.js";
import { DataTypes } from "sequelize";
export const UserModel = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "U_firstName",
      validate: {
        notEmpty: { msg: "PLease fill required field First Name" },
        len: { msg: "min length is 2 and max length is 20", args: [2, 20] },
      },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "U_middleName",
      validate: {
        notEmpty: { msg: "PLease fill required field Middle Name" },
        len: { msg: "min length is 2 and max length is 20", args: [2, 20] },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "U_lastName",
      validate: {
        notEmpty: { msg: "PLease fill required field Last Name" },
        len: { msg: "min length is 2 and max length is 20", args: [2, 20] },
      },
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      set(value) {
        const [firstName, middleName, lastName] =
          value?.trim().split(" ") || [];
        this.setDataValue("firstName", firstName);
        this.setDataValue("middleName", middleName);
        this.setDataValue("lastName", lastName);
      },
      get() {
        return (
          this.getDataValue("firstName") +
          " " +
          this.getDataValue("middleName") +
          " " +
          this.getDataValue("lastName")
        );
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "U_email",
      validate: {
        notEmpty: { msg: "PLease fill required field Email" },
        isEmail: { msg: "Please write correct Email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "U_password",
      validate: {
        notEmpty: { msg: "PLease fill required field Password" },
      },
    },
    DOB: {
      type: DataTypes.DATE,
      field: "U_DOB",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      defaultValue: "male",
      field: "U_gender",
    },
    confirmEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "U_confirmEmail",
    },
  },
  {
    createdAt: "U_createdAt",
    updatedAt: "U_updatedAt",
    validate: {
      checkGender() {
        if (this.gender !== "male" && this.gender !== "female") {
          throw new Error("Gender Must be either male or female");
        }
      },
    },
  }
);
