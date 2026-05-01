import { connection } from "../../app.controller.js";

export const createBlog = (req, res, next) => {
  const { title, content, author_id } = req.body;
  if (!title || !content || !author_id)
    return res.status(400).json({ message: "Invalid Data" });
  const userQuery = `select * from users where u_id=?`;
  const BlogQuery = `insert into blogs (b_title,b_content,b_author_id) values(?,?,?)`;
  connection.execute(userQuery, [author_id], (err, data) => {
    if (err) return res.status(500).json({ message: "Error in SQL", err });
    if (!data.length)
      return res.status(404).json({ message: "User Not Found" });
    connection.execute(BlogQuery, [title, content, author_id], (err, data) => {
      if (err) return res.status(500).json({ message: "Error in SQL", err });
      return res.status(201).json({ message: "Blog Created Successfully" });
    });
  });
};

export const getUserBlogs = (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid Data" });
  const userQuery = `select * from users where u_id=?`;
  const BlogQuery = `select * from blogs where b_author_id=?`;
  connection.execute(userQuery, [id], (err, data) => {
    if (err) return res.status(500).json({ message: "Error in SQL", err });
    if (!data.length)
      return res.status(404).json({ message: "User Not Found" });
    connection.execute(BlogQuery, [id], (err, data) => {
      if (err) return res.status(500).json({ message: "Error in SQL", err });
      if (!data.length)
        return res.status(404).json({ message: "User Does not have blogs" });
      return res.status(200).json({ message: "Done", data });
    });
  });
};
