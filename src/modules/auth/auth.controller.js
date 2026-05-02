import { UserModel } from "../../DB/models/user.model.js";
import { successResponse, errorHandling } from "../../utils/response.js";
import {
  comparePassword,
  hashPassword,
} from "../../utils/security/hash.security.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = hashPassword({ plainText: password });
    const data = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return successResponse({
      res,
      message: "User Created Successfully",
      status: 201,
      data,
    });
  } catch (error) {
    return await errorHandling({ res, error });
  }
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const existQuery = "select * from users where u_email=?";
  connection.execute(existQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    if (!data.length)
      return res.status(404).json({ message: "Invalid Email or Password" });
    const matchPassword = comparePassword({
      password: password,
      hashedPassword: data[0].u_password,
    });
    if (!matchPassword)
      return res.status(404).json({ message: "Invalid Email or Password" });
    return res
      .status(200)
      .json({ message: "User Logged In Successfully", user: data[0] });
  });
};
