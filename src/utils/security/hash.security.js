import bcrypt from "bcryptjs";

export const hashPassword = ({
  plainText = "",
  salt = process.env.SALT,
} = {}) => {
  return bcrypt.hashSync(plainText, parseInt(salt));
};

export const comparePassword = ({
  password = "",
  hashedPassword = "",
} = {}) => {
  return bcrypt.compareSync(password, hashedPassword);
};
