import { connection } from "../../app.controller.js";
import {
  comparePassword,
  hashPassword,
} from "../../utils/security/hash.security.js";

export const signup = (req, res, next) => {
  const { firstName, middleName, lastName, email, password } = req.body;
  const existQuery = "select * from users where u_email=?";
  connection.execute(existQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    if (data.length) return res.status(409).json({ message: "Email Exist" });

    const hashedPassword = hashPassword({ plainText: password });

    const insertQuery = `insert into users (u_fname,u_mname,u_lname,u_email,u_password)values(?,?,?,?,?)`;
    connection.execute(
      insertQuery,
      [firstName, middleName, lastName, email, hashedPassword],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "error in sql query", err });
        }
        return res.status(201).json({ message: "User Created Successfully" });
      }
    );
  });
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
