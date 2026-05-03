import { UserModel } from "../../DB/models/user.model.js";
import { successResponse, errorHandling } from "../../utils/response.js";
import {
  comparePassword,
  hashPassword,
} from "../../utils/security/hash.security.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, gender } = req.body;
    const hashedPassword = hashPassword({ plainText: password });
    const user = await UserModel.findOrCreate({
      where: { email: email },
      defaults: { fullName, email, password: hashedPassword, gender },
    });
    if (!user[1])
      return res.status(409).json({ message: "Email already exist" });
    return successResponse({
      res,
      message: "User Created Successfully",
      status: 201,
      data: user[0],
    });
  } catch (error) {
    return await errorHandling({ res, error });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email: email } });
    if (!user)
      return res.status(404).json({ message: "Invalid Email or Password" });
    const matchPassword = comparePassword({
      password: password,
      hashedPassword: user.password,
    });
    if (!matchPassword)
      return res.status(404).json({ message: "Invalid Email or Password" });
    return successResponse({
      res,
      message: "User Logged In Successfully",
      data: user,
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};
