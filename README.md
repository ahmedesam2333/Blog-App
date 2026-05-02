<div align="center">

<h1>📝 BlogWave App</h1>
<p><strong>Simple Blog Platform — REST API Backend</strong></p>

![Status](https://img.shields.io/badge/Status-In_Progress-f59e0b?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MySQL2](https://img.shields.io/badge/MySQL2-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-2D6A9F?style=for-the-badge&logo=sequelize&logoColor=white)

<br/>

> A backend system for a blog platform where users can register, log in, manage their profiles, and create & manage their blog posts.  
> Built with MySQL2 for raw SQL queries (auth & user modules) and Sequelize ORM (user model layer) — both used actively in the project.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Database Design](#%EF%B8%8F-database-design)
- [Features](#-features)
- [Project Structure](#%EF%B8%8F-project-structure)
- [API Documentation](#-api-documentation)
- [Author](#-author)

---

## 🧠 Overview

BlogWave is a blog platform where users can register, log in, manage their profiles, and create & manage their own blog posts. This repository contains the **backend API** built with Node.js, Express.js, and MySQL — using **both MySQL2 and Sequelize ORM** actively in the project. MySQL2 handles raw SQL queries in the auth and blog modules, while Sequelize ORM is used for the User model layer with built-in and custom validators, virtual fields, and getter/setter hooks.

**Core concepts:**
- Users register and log in with bcrypt-hashed passwords
- Users can view, search, update, and delete their profiles
- Users can create blog posts and retrieve all blogs by a specific user
- Relational schema with FK constraints — deleting a user cascades to their blogs
- Sequelize `UserModel` features a `VIRTUAL` `fullName` field with getter/setter, built-in validators, custom model-level validators, and mapped column names via `field`
- Uniform API responses via centralized `successResponse` and `errorHandling` utilities with Sequelize-aware error type switching

---

## 🗃️ Database Design

### Entity Relationship Diagram (ERD)

<div align="center">
  <a href="https://drive.google.com/file/d/1vc0QEbaS6BirYrWNvwwKIUpDNxVf8JWn/view?usp=sharing" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1vc0QEbaS6BirYrWNvwwKIUpDNxVf8JWn" alt="BlogWave ERD" width="80%"/>
  </a>
  <br/>
  <sub>🔍 <a href="https://drive.google.com/file/d/1vc0QEbaS6BirYrWNvwwKIUpDNxVf8JWn/view?usp=sharing">Click to view full size</a></sub>
</div>

<br/>

**Key relationships:**
- A `User` can **create** many `Blog` posts — one-to-many (`1:M`)
- `fullName` is a composite attribute — broken into `fName`, `mName`, `lName`
- `Phone` is a multi-valued attribute — stored in a separate `User-Phone` table
- `Age` is a derived attribute — calculated from `DOB`

---

### DB Mapping

<div align="center">
  <a href="https://drive.google.com/file/d/1hcegWRwvAltj3nGKgsL068BnytvRLah2/view?usp=sharing" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1hcegWRwvAltj3nGKgsL068BnytvRLah2" alt="BlogWave DB Mapping" width="80%"/>
  </a>
  <br/>
  <sub>🔍 <a href="https://drive.google.com/file/d/1hcegWRwvAltj3nGKgsL068BnytvRLah2/view?usp=sharing">Click to view full size</a></sub>
</div>

<br/>

**Tables:**

| Table | Primary Key | Foreign Key | Description |
|---|---|---|---|
| `User` | `ID` | — | Stores all user account data |
| `User-Phone` | `userId, phone` | `userId → User.ID` | Multi-valued phone numbers per user |
| `Blog` | `ID` | `authorId → User.ID` | Blog posts created by users |

---

## ✅ Features

### ✔️ Completed

- [x] Folder structure & project setup
- [x] MySQL database connection via **MySQL2** and **Sequelize ORM**
- [x] User model via Sequelize — `UserModel` with built-in validators, custom model-level validator, and `VIRTUAL` `fullName` field with getter & setter (`src/DB/models/user.model.js`)

<details>
<summary><strong>🗃️ UserModel — Sequelize</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
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
```

</details>

- [x] Sign Up & Login endpoints
- [x] Centralized response utilities — `successResponse` & `errorHandling` with Sequelize-aware error type switching (`src/utils/response.js`)

<details>
<summary><strong>📦 successResponse + errorHandling</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
export const errorHandling = async ({ res, error } = {}) => {
  switch (error?.name) {
    case "SequelizeValidationError":
      return res.status(400).json({ message: "Validation Error", error });
    case "SequelizeUniqueConstraintError":
      return res.status(409).json({ message: "UniqueConstraintError", error });
    default:
      return res.status(500).json({
        message: "Server Error",
        err_message: error.message,
        stack: error.stack,
        error,
      });
  }
};

export const successResponse = async ({
  res,
  status = 200,
  message = "Done",
  data = {},
} = {}) => {
  return res.status(status).json({
    message,
    data,
  });
};
```

</details>

- [x] Environment variables setup (`dotenv`)
- [x] Hashing — `bcrypt` implementation for passwords (`src/utils/security/hash.security.js`)

<details>
<summary><strong>🔒 Hashing — bcrypt</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
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
```

</details>

- [x] User CRUD — get profile, search, update, delete
- [x] Blog model — `blogs` table with `b_id`, `b_title`, `b_content`, `b_createdAt`, `b_updatedAt`, `b_author_id` (FK → `users.u_id` ON UPDATE CASCADE ON DELETE CASCADE)
- [x] Blog endpoints — create blog, get all blogs by user

---

### 🔜 Upcoming

- [ ] Update blog, delete blog
- [ ] Get single blog by ID
- [ ] Migrate blog module to Sequelize ORM

---

## 🗂️ Project Structure

```
BLOGWAVE-APP/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   └── user.routes.js
│   │   └── blog/
│   │       ├── blog.controller.js      (createBlog, getUserBlogs)
│   │       └── blog.routes.js
│   ├── DB/
│   │   ├── models/
│   │   │   └── user.model.js           (Sequelize UserModel — virtual fullName, validators, field mapping)
│   │   └── db.connection.js
│   └── utils/
│       ├── response.js                 (successResponse + errorHandling — Sequelize-aware error switching)
│       └── security/
│           └── hash.security.js        (bcrypt hashPassword + comparePassword)
│   ├── app.controller.js               (main app setup / route mounting)
│   └── index.js                        (entry point)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 📖 API Documentation

> Base URL: `http://localhost:5000`

---

## 🔑 Auth — `/auth`

<details>
<summary><strong>Routes</strong> — <em>auth.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as authController from "./auth.controller.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

export default router;
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/signup</strong> — Register a new user</summary>

<br/>

> 🔓 Public — no authentication required.

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "middleName": "Essam",
  "lastName": "Hamdy",
  "email": "a1@gmail.com",
  "password": "123456"
}
```

**Response `201` — Success:**
```json
{
  "message": "User Created Successfully"
}
```

**Response `409` — Email already exists:**
```json
{ "message": "Email Exist" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const signup = (req, res, next) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  const existQuery = "SELECT * FROM users WHERE u_email = ?";
  connection.execute(existQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    if (data.length) {
      return res.status(409).json({ message: "Email Exist" });
    }

    const hashedPassword = hashPassword({ plainText: password });

    const insertQuery = `
      INSERT INTO users (u_fname, u_mname, u_lname, u_email, u_password)
      VALUES (?, ?, ?, ?, ?)
    `;
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
```

</details>

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/login</strong> — Login with credentials</summary>

<br/>

> 🔓 Public — no authentication required.

**Request Body:**
```json
{
  "email": "a1@gmail.com",
  "password": "123456"
}
```

**Response `200` — Success:**
```json
{
  "message": "User Logged In Successfully",
  "user": {
    "u_id": 1,
    "u_fname": "Ahmed",
    "u_mname": "Essam",
    "u_lname": "Hamdy",
    "u_email": "a1@gmail.com"
  }
}
```

**Response `404` — Invalid credentials:**
```json
{ "message": "Invalid Email or Password" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const login = (req, res, next) => {
  const { email, password } = req.body;

  const existQuery = "SELECT * FROM users WHERE u_email = ?";
  connection.execute(existQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    if (!data.length) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    const matchPassword = comparePassword({
      password: password,
      hashedPassword: data[0].u_password,
    });
    if (!matchPassword) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    return res.status(200).json({
      message: "User Logged In Successfully",
      user: data[0],
    });
  });
};
```

</details>

</details>

---

## 👤 User — `/user`

<details>
<summary><strong>Routes</strong> — <em>user.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as userController from "./user.controller.js";
const router = express.Router();

router.get("/search", userController.searchUser);
router.get("/:id", userController.getUserProfile);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/:id</strong> — Get user profile by ID</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
GET http://localhost:5000/user/1
```

**Response `200` — Success:**
```json
{
  "message": "User Found",
  "user": {
    "fullName": "Ziad Essam Hamdy",
    "u_email": "a@gmail.com",
    "age": 24
  }
}
```

**Response `404` — User not found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const getUserProfile = (req, res, next) => {
  const sql = `SELECT CONCAT(u_fname, ' ', u_mname, ' ', u_lname) AS fullName,
    u_email,
    TIMESTAMPDIFF(YEAR, u_DOB, NOW()) AS age 
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
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/search</strong> — Search users by first name</summary>

<br/>

> 🔓 Public — no authentication required.

**Query Params:**
```
GET http://localhost:5000/user/search?searchKey=a
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": [
    {
      "u_id": 1,
      "u_email": "a@gmail.com",
      "u_gender": "male",
      "u_DOB": "2001-11-24T22:00:00.000Z",
      "u_fname": "Ziad",
      "u_mname": "Essam",
      "u_lname": "Hamdy",
      "u_confirmEmail": 0,
      "u_createdAt": "2026-04-30T02:18:32.000Z",
      "u_updatedAt": "2026-05-01T03:10:24.000Z"
    }
  ]
}
```

**Response `404` — No users found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
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
```

</details>

</details>

---

<details>
<summary><code>PATCH</code> &nbsp; <strong>/user/:id</strong> — Update user first name and date of birth</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
PATCH http://localhost:5000/user/1
```

**Request Body:**
```json
{
  "firstName": "Eyad",
  "DOB": "2002-11-25"
}
```

**Response `200` — Success:**
```json
{
  "message": "User Updated Successfully",
  "data": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "Rows matched: 1  Changed: 1  Warnings: 0",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 1
  }
}
```

**Response `400` — Missing required fields:**
```json
{ "message": "Invalid Data" }
```

**Response `404` — User not found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { firstName, DOB } = req.body;
  if (!firstName || !DOB)
    return res.status(400).json({ message: "Invalid Data" });
  const sql = `UPDATE users 
    SET u_fname = ?, u_DOB = ?
    WHERE u_id = ?`;
  connection.execute(sql, [firstName, DOB, id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.affectedRows
      ? res.status(200).json({ message: "User Updated Successfully", data })
      : res.status(404).json({ message: "User Not Found" });
  });
};
```

</details>

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/user/:id</strong> — Delete a user by ID</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
DELETE http://localhost:5000/user/3
```

**Response `204` — Deleted successfully:**
```
(no content)
```

**Response `400` — Missing ID param:**
```json
{ "message": "Invalid Data" }
```

**Response `404` — User not found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Database error:**
```json
{ "message": "error in sql query", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const deleteUser = (req, res, next) => {
  if (!req.params.id) return res.status(400).json({ message: "Invalid Data" });
  const sql = `DELETE FROM users WHERE u_id = ?`;
  connection.execute(sql, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error in sql query", err });
    }
    return data.affectedRows
      ? res.status(204).json({})
      : res.status(404).json({ message: "User Not Found" });
  });
};
```

</details>

</details>

---

## 📄 Blog — `/blog`

<details>
<summary><strong>Routes</strong> — <em>blog.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as blogController from "./blog.controller.js";
const router = express.Router();

router.post("/", blogController.createBlog);
router.get("/user/:id", blogController.getUserBlogs);

export default router;
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/blog</strong> — Create a new blog post</summary>

<br/>

> 🔓 Public — no authentication required.

**Request Body:**
```json
{
  "title": "Instagram",
  "content": "this post i wrote",
  "author_id": 4
}
```

**Response `201` — Success:**
```json
{
  "message": "Blog Created Successfully"
}
```

**Response `400` — Missing required fields:**
```json
{ "message": "Invalid Data" }
```

**Response `404` — Author user not found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Database error:**
```json
{ "message": "Error in SQL", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const createBlog = (req, res, next) => {
  const { title, content, author_id } = req.body;
  if (!title || !content || !author_id)
    return res.status(400).json({ message: "Invalid Data" });
  const userQuery = `SELECT * FROM users WHERE u_id = ?`;
  const BlogQuery = `INSERT INTO blogs (b_title, b_content, b_author_id) VALUES (?, ?, ?)`;
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
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/blog/user/:id</strong> — Get all blogs by a user</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
GET http://localhost:5000/blog/user/4
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": [
    {
      "b_id": 2,
      "b_title": "Instagram",
      "b_content": "this post i wrote",
      "b_createdAt": "2026-05-01T03:55:21.000Z",
      "b_updatedAt": "2026-05-01T03:55:21.000Z",
      "b_author_id": 4
    },
    {
      "b_id": 3,
      "b_title": "Instagram",
      "b_content": "this post i wrote",
      "b_createdAt": "2026-05-01T03:59:40.000Z",
      "b_updatedAt": "2026-05-01T03:59:40.000Z",
      "b_author_id": 4
    }
  ]
}
```

**Response `400` — Missing ID param:**
```json
{ "message": "Invalid Data" }
```

**Response `404` — User not found:**
```json
{ "message": "User Not Found" }
```

**Response `404` — User has no blogs:**
```json
{ "message": "User Does not have blogs" }
```

**Response `500` — Database error:**
```json
{ "message": "Error in SQL", "err": "<error details>" }
```

<details>
<summary><em>Controller code — MySQL2</em></summary>

```javascript
export const getUserBlogs = (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid Data" });
  const userQuery = `SELECT * FROM users WHERE u_id = ?`;
  const BlogQuery = `SELECT * FROM blogs WHERE b_author_id = ?`;
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
```

</details>

</details>

---

## 👨‍💻 Author

**Ahmed Essam** — Node.js Backend Engineer  
📩 ahmedezsam@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/ahmed-essam-33b989221)

---

<div align="center">
<sub>Built with focus, coffee, and clean architecture principles ☕</sub>
</div>
