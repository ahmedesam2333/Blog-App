import { connection } from "../../app.controller.js";

export const getAllUsers = (req, res, next) => {
  const sql = "SELECT * FROM USER";
  connection.execute(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return res.status(200).json({ message: "Done", data });
  });
};
