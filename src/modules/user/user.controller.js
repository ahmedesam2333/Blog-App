import { connection } from "../../app.controller.js";

export const getUserProfile = (req, res, next) => {
  const sql = `SELECT CONCAT(u_fname, ' ', u_mname, ' ', u_lname) AS fullName,u_email,TIMESTAMPDIFF(YEAR, u_DOB, NOW()) AS age 
    FROM users 
    WHERE u_id = ?`;
  connection.execute(sql, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.length
      ? res.status(200).json({ message: "User Found", user: data[0] })
      : res.status(404).json({ message: "User Not Found" });
  });
};

export const searchUser = (req, res, next) => {
  const { searchKey } = req.query;
  const sql = "SELECT * FROM users WHERE u_fname like ?";
  connection.execute(sql, ["%" + searchKey + "%"], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.length
      ? res.status(200).json({ message: "Done", data })
      : res.status(404).json({ message: "User Not Found" });
  });
};

export const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { firstName, DOB } = req.body;
  if (!firstName || !DOB)
    return res.status(400).json({ message: "Invalid Data" });
  const sql = `update users 
  set u_fname=? , u_DOB=?
  where u_id =?`;
  connection.execute(sql, [firstName, DOB, id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.affectedRows
      ? res.status(200).json({ message: "User Updated Successfully", data })
      : res.status(404).json({ message: "User Not Found" });
  });
};

export const deleteUser = (req, res, next) => {
  if (!req.params.id) return res.status(400).json({ message: "Invalid Data" });
  const sql = `delete from users where u_id =?`;
  connection.execute(sql, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.affectedRows
      ? res.status(204).json({})
      : res.status(404).json({ message: "User Not Found" });
  });
};
