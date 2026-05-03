<div align="center">

<h1>📝 BlogWave App</h1>
<p><strong>Simple Blog Platform — REST API Backend</strong></p>

![Status](https://img.shields.io/badge/Status-Completed-22c55e?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MySQL2](https://img.shields.io/badge/MySQL2-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-2D6A9F?style=for-the-badge&logo=sequelize&logoColor=white)

<br/>

> A completed blog platform REST API where users can register, log in, manage profiles, and create & manage blog posts.  
> Built with both **MySQL2** (raw SQL) and **Sequelize ORM** — featuring soft delete, pagination, eager loading, and model associations.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Database Design](#%EF%B8%8F-database-design)
- [Features](#-features)
- [Project Structure](#%EF%B8%8F-project-structure)
- [API Documentation](#-api-documentation)
- [MySQL2 — Phase 1](#%EF%B8%8F-mysql2--phase-1-raw-sql)
- [Author](#-author)

---

## 🧠 Overview

BlogWave is a completed blog platform REST API built with Node.js, Express.js, and MySQL — using **both MySQL2 and Sequelize ORM** in the same project. Auth endpoints use MySQL2 raw SQL (Phase 1), while all user and blog management is fully powered by Sequelize ORM with models, associations, validators, and paranoid soft delete.

**Core concepts:**
- Users register via `findOrCreate` and log in with bcrypt-hashed passwords
- Full user management — profile with eager-loaded blogs, paginated search, update, soft delete (freeze), restore, hard delete, and truncate
- Blog management — create, get by ID with author info, paginated search by title, soft delete (freeze), and restore
- `UserModel` and `BlogModel` are Sequelize models with `paranoid: true` for soft delete — `deletedAt` tracks frozen records
- `BlogModel.belongsTo(UserModel)` and `UserModel.hasMany(BlogModel)` with `CASCADE` on delete and update
- Centralized `successResponse` and `errorHandling` utilities with Sequelize-aware error type switching

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
| `Blog` | `ID` | `B_author_id → User.ID` | Blog posts created by users |

---

## ✅ Features

### ✔️ Completed

- [x] Folder structure & project setup
- [x] MySQL database connection via **MySQL2** and **Sequelize ORM**
- [x] `UserModel` — Sequelize model with `VIRTUAL` `fullName`, built-in & custom validators, field mapping, and `paranoid: true` soft delete
- [x] `BlogModel` — Sequelize model with validators, `paranoid: true`, and full associations (`belongsTo` / `hasMany`) with CASCADE

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
        const [firstName, middleName, lastName] = value?.trim().split(" ") || [];
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
    DOB: { type: DataTypes.DATE, field: "U_DOB" },
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
    paranoid: true,
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

<details>
<summary><strong>🗃️ BlogModel — Sequelize + Associations</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
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
  foreignKey: { name: "B_author_id", allowNull: false },
});

UserModel.hasMany(BlogModel, {
  foreignKey: { name: "B_author_id", allowNull: false },
});
```

</details>

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
  return res.status(status).json({ message, data });
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

export const hashPassword = ({ plainText = "", salt = process.env.SALT } = {}) => {
  return bcrypt.hashSync(plainText, parseInt(salt));
};

export const comparePassword = ({ password = "", hashedPassword = "" } = {}) => {
  return bcrypt.compareSync(password, hashedPassword);
};
```

</details>

- [x] Auth — signup (`findOrCreate`) and login via Sequelize
- [x] User — get profile with eager-loaded blogs, paginated search, update, freeze (soft delete), restore, hard delete, truncate table
- [x] Blog — create, get by ID with author info, paginated search by title, freeze (soft delete), restore

---

## 🗂️ Project Structure

```
BLOGWAVE-APP/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js      (signup, login — Sequelize)
│   │   │   └── auth.routes.js
│   │   ├── user/
│   │   │   ├── user.controller.js      (getUserProfile, searchUser, updateUser, freezeUser, restoreUser, hardDeleteUser, truncateTable)
│   │   │   └── user.routes.js
│   │   └── blog/
│   │       ├── blog.controller.js      (createBlog, getBlog, searchBlogs, freezeBlog, restoreBlog)
│   │       └── blog.routes.js
│   ├── DB/
│   │   ├── models/
│   │   │   ├── user.model.js           (Sequelize UserModel — virtual fullName, validators, paranoid soft delete)
│   │   │   └── blog.model.js           (Sequelize BlogModel — validators, paranoid, belongsTo/hasMany associations)
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
  "fullName": "Ahmed Essam Hamdy",
  "email": "a@gmail.com",
  "password": "123456"
}
```

**Response `201` — Success:**
```json
{
  "message": "User Created Successfully",
  "data": {
    "fullName": "Ahmed Essam Hamdy",
    "gender": "male",
    "confirmEmail": false,
    "id": 3,
    "firstName": "Ahmed",
    "middleName": "Essam",
    "lastName": "Hamdy",
    "email": "a1@gmail.com",
    "password": "<hashed>",
    "U_updatedAt": "2026-05-03T04:41:28.267Z",
    "U_createdAt": "2026-05-03T04:41:28.267Z"
  }
}
```

**Response `409` — Email already exists:**
```json
{ "message": "Email already exist" }
```

**Response `400` — Validation error:**
```json
{ "message": "Validation Error", "error": "<sequelize validation details>" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, gender } = req.body;
    const hashedPassword = hashPassword({ plainText: password });
    const user = await UserModel.findOrCreate({
      where: { email },
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
  "data": {
    "fullName": "Ahmed Essam Hamdy",
    "id": 3,
    "firstName": "Ahmed",
    "middleName": "Essam",
    "lastName": "Hamdy",
    "email": "a1@gmail.com",
    "DOB": null,
    "gender": "male",
    "confirmEmail": false,
    "U_createdAt": "2026-05-03T04:41:28.000Z",
    "U_updatedAt": "2026-05-03T04:41:28.000Z",
    "deletedAt": null
  }
}
```

**Response `404` — Invalid credentials:**
```json
{ "message": "Invalid Email or Password" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Invalid Email or Password" });
    const matchPassword = comparePassword({
      password,
      hashedPassword: user.password,
    });
    if (!matchPassword)
      return res.status(404).json({ message: "Invalid Email or Password" });
    return successResponse({ res, message: "User Logged In Successfully", data: user });
  } catch (error) {
    errorHandling({ res, error });
  }
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
router.patch("/:id/restore", userController.restoreUser);
router.delete("/truncate", userController.truncateTable);
router.delete("/:id/freeze", userController.freezeUser);
router.delete("/:id/hard", userController.hardDeleteUser);

export default router;
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/:id</strong> — Get user profile with their blogs</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
GET http://localhost:5000/user/1
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "fullName": "Mazen Mohammed Hmmad",
    "id": 1,
    "firstName": "Mazen",
    "middleName": "Mohammed",
    "lastName": "Hmmad",
    "email": "m@gmail.com",
    "DOB": null,
    "gender": "male",
    "confirmEmail": false,
    "U_createdAt": "2026-05-03T04:06:05.000Z",
    "U_updatedAt": "2026-05-03T04:06:05.000Z",
    "deletedAt": null,
    "Blogs": [
      { "content": "this post i wrote", "title": "Hi ALL" },
      { "content": "this post i wrote", "title": "Hi from instagram" }
    ]
  }
}
```

**Response `400` — Missing ID:**
```json
{ "message": "ID required" }
```

**Response `404` — User not found:**
```json
{ "message": "User not found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: BlogModel, attributes: ["content", "title"] }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, data: user });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/search</strong> — Search users by first name with pagination</summary>

<br/>

> 🔓 Public — no authentication required.

**Query Params:**
```
GET http://localhost:5000/user/search?search=ahmed&page=1&size=2
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "pageSize": "2",
  "pages": 2,
  "users": {
    "count": 3,
    "rows": [
      {
        "fullName": "Ahmed Essam Hamdy",
        "id": 2,
        "firstName": "Ahmed",
        "middleName": "Essam",
        "lastName": "Hamdy",
        "email": "a@gmail.com",
        "DOB": null,
        "gender": "male",
        "confirmEmail": false,
        "U_createdAt": "2026-05-03T04:06:31.000Z",
        "U_updatedAt": "2026-05-03T04:06:31.000Z",
        "deletedAt": null
      }
    ]
  }
}
```

**Response `400` — Missing required query params:**
```json
{ "message": "Please add required fields" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const searchUser = async (req, res, next) => {
  try {
    const { search, page, size } = req.query;
    if (!search || !page || !size)
      return res.status(400).json({ message: "Please add required fields" });
    const currentPage = parseInt(page < 1 ? 1 : page);
    const users = await UserModel.findAndCountAll({
      where: { firstName: { [Op.substring]: search } },
      offset: parseInt((currentPage - 1) * size),
      limit: parseInt(size < 1 ? 5 : size),
    });
    return res.status(200).json({
      message: "Done",
      pageSize: size,
      pages: Math.ceil(users.count / size),
      users,
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>PATCH</code> &nbsp; <strong>/user/:id</strong> — Update user data</summary>

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
  "message": "User Updated",
  "data": {}
}
```

**Response `400` — Missing ID or failed update:**
```json
{ "message": "ID required" }
```

**Response `400` — Validation error:**
```json
{ "message": "Validation Error", "error": "<sequelize validation details>" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.update(req.body, { where: { id } });
    return user[0]
      ? successResponse({ res, message: "User Updated" })
      : res.status(400).json({ message: "Failed to Update" });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/user/:id/freeze</strong> — Soft delete a user (paranoid)</summary>

<br/>

> 🔓 Public — no authentication required. Sets `deletedAt` timestamp — user is hidden but not removed.

**URL Params:**
```
DELETE http://localhost:5000/user/2/freeze
```

**Response `204` — Frozen successfully:**
```
(no content)
```

**Response `400` — Missing ID:**
```json
{ "message": "ID required" }
```

**Response `404` — User not found:**
```json
{ "message": "User not found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const freezeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.destroy({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>PATCH</code> &nbsp; <strong>/user/:id/restore</strong> — Restore a soft-deleted user</summary>

<br/>

> 🔓 Public — no authentication required. Clears `deletedAt` — user becomes active again.

**URL Params:**
```
PATCH http://localhost:5000/user/2/restore
```

**Response `200` — Success:**
```json
{
  "message": "User restored",
  "data": {}
}
```

**Response `400` — Missing ID:**
```json
{ "message": "ID required" }
```

**Response `404` — User not found:**
```json
{ "message": "User not found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.restore({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, message: "User restored", status: 200 });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/user/:id/hard</strong> — Hard delete a user (permanent)</summary>

<br/>

> 🔓 Public — no authentication required. Permanently removes the user from the database with `force: true`.

**URL Params:**
```
DELETE http://localhost:5000/user/2/hard
```

**Response `204` — Deleted permanently:**
```
(no content)
```

**Response `400` — Missing ID:**
```json
{ "message": "ID required" }
```

**Response `404` — User not found:**
```json
{ "message": "User not found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const hardDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID required" });
    const user = await UserModel.destroy({ where: { id }, force: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/user/truncate</strong> — Truncate the users table</summary>

<br/>

> ⚠️ Destructive — removes all records from the users table.

**URL:**
```
DELETE http://localhost:5000/user/truncate
```

**Response `204` — Truncated successfully:**
```
(no content)
```

**Response `404` — Table already empty:**
```json
{ "message": "Table is empty" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const truncateTable = async (req, res, next) => {
  try {
    const table = await UserModel.destroy({ truncate: true });
    if (!table) return res.status(404).json({ message: "Table is empty" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
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
router.get("/:id", blogController.getBlog);
router.get("/search", blogController.searchBlogs);
router.delete("/:id/freeze", blogController.freezeBlog);
router.patch("/:id/restore", blogController.restoreBlog);

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
  "title": "Hi from facebook",
  "content": "this post i wrote",
  "author_id": 1
}
```

**Response `201` — Success:**
```json
{
  "message": "Blog Created Successfully",
  "data": {
    "id": 4,
    "title": "Hi from facebook",
    "content": "this post i wrote",
    "B_author_id": 1,
    "B_updatedAt": "2026-05-03T04:51:44.849Z",
    "B_createdAt": "2026-05-03T04:51:44.849Z"
  }
}
```

**Response `400` — Missing required fields:**
```json
{ "message": "Invalid Data" }
```

**Response `400` — Validation error:**
```json
{ "message": "Validation Error", "error": "<sequelize validation details>" }
```

**Response `404` — Author not found:**
```json
{ "message": "User Not Found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, author_id } = req.body;
    if (!title || !content || !author_id)
      return res.status(400).json({ message: "Invalid Data" });
    const user = await UserModel.findByPk(author_id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    const blog = await BlogModel.create({ title, content, B_author_id: author_id });
    return successResponse({ res, status: 201, message: "Blog Created Successfully", data: blog });
  } catch (error) {
    return errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/blog/:id</strong> — Get a blog by ID with author info</summary>

<br/>

> 🔓 Public — no authentication required.

**URL Params:**
```
GET http://localhost:5000/blog/1
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "id": 1,
    "title": "Hi ALL",
    "content": "this post i wrote",
    "B_createdAt": "2026-05-03T04:06:48.000Z",
    "B_updatedAt": "2026-05-03T04:06:48.000Z",
    "deletedAt": null,
    "B_author_id": 1,
    "User": {
      "fullName": "Eyad Mohammed Hmmad",
      "id": 1,
      "firstName": "Eyad",
      "middleName": "Mohammed",
      "lastName": "Hmmad",
      "email": "m@gmail.com",
      "DOB": "2002-11-25T00:00:00.000Z",
      "gender": "male",
      "confirmEmail": false,
      "U_createdAt": "2026-05-03T04:06:05.000Z",
      "U_updatedAt": "2026-05-03T04:46:19.000Z",
      "deletedAt": null
    }
  }
}
```

**Response `400` — Missing ID:**
```json
{ "message": "Invalid Data" }
```

**Response `404` — Blog not found:**
```json
{ "message": "Blog Not Found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid Data" });
    const blog = await BlogModel.findByPk(id, {
      include: [{ model: UserModel, attributes: { exclude: "password" } }],
    });
    if (!blog) return res.status(404).json({ message: "Blog Not Found" });
    return successResponse({ res, data: blog });
  } catch (error) {
    return errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/blog/search</strong> — Search blogs by title with pagination</summary>

<br/>

> 🔓 Public — no authentication required.

**Query Params:**
```
GET http://localhost:5000/blog/search?search=Hi&page=1&size=2
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "pageSize": "2",
  "pages": 2,
  "blogs": {
    "count": 4,
    "rows": [
      {
        "id": 1,
        "title": "Hi ALL",
        "content": "this post i wrote",
        "B_createdAt": "2026-05-03T04:06:48.000Z",
        "B_updatedAt": "2026-05-03T04:06:48.000Z",
        "deletedAt": null,
        "B_author_id": 1,
        "User": {
          "fullName": "Eyad Mohammed Hmmad",
          "id": 1,
          "email": "m@gmail.com",
          "gender": "male"
        }
      }
    ]
  }
}
```

**Response `400` — Missing required query params:**
```json
{ "message": "Please add required fields" }
```

**Response `404` — No blogs found:**
```json
{ "message": "No Blogs Found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const searchBlogs = async (req, res, next) => {
  try {
    const { search, page, size } = req.query;
    if (!search || !page || !size)
      return res.status(400).json({ message: "Please add required fields" });
    const currentPage = parseInt(page < 1 ? 1 : page);
    const blogs = await BlogModel.findAndCountAll({
      where: { title: { [Op.substring]: search } },
      offset: parseInt((currentPage - 1) * size),
      limit: parseInt(size < 1 ? 5 : size),
      include: [{ model: UserModel, attributes: { exclude: "password" } }],
    });
    if (!blogs.rows.length)
      return res.status(404).json({ message: "No Blogs Found" });
    return res.status(200).json({
      message: "Done",
      pageSize: size,
      pages: Math.ceil(blogs.count / size),
      blogs,
    });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/blog/:id/freeze</strong> — Soft delete a blog (paranoid)</summary>

<br/>

> 🔓 Public — no authentication required. Sets `deletedAt` — blog is hidden but not removed.

**URL Params:**
```
DELETE http://localhost:5000/blog/2/freeze
```

**Response `204` — Frozen successfully:**
```
(no content)
```

**Response `400` — Missing ID:**
```json
{ "message": "Please Add ID" }
```

**Response `404` — Blog not found:**
```json
{ "message": "No Blog Found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const freezeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please Add ID" });
    const blog = await BlogModel.destroy({ where: { id } });
    if (!blog) return res.status(404).json({ message: "No Blog Found" });
    return successResponse({ res, status: 204 });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

<details>
<summary><code>PATCH</code> &nbsp; <strong>/blog/:id/restore</strong> — Restore a soft-deleted blog</summary>

<br/>

> 🔓 Public — no authentication required. Clears `deletedAt` — blog becomes visible again.

**URL Params:**
```
PATCH http://localhost:5000/blog/2/restore
```

**Response `200` — Success:**
```json
{
  "message": "Blog restored successfully",
  "data": {}
}
```

**Response `400` — Missing ID:**
```json
{ "message": "Please Add ID" }
```

**Response `404` — Blog not found:**
```json
{ "message": "No Blog Found" }
```

**Response `500` — Server error:**
```json
{ "message": "Server Error", "err_message": "<error details>" }
```

<details>
<summary><em>Controller code — Sequelize</em></summary>

```javascript
export const restoreBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please Add ID" });
    const blog = await BlogModel.restore({ where: { id } });
    if (!blog) return res.status(404).json({ message: "No Blog Found" });
    return successResponse({ res, message: "Blog restored successfully" });
  } catch (error) {
    errorHandling({ res, error });
  }
};
```

</details>

</details>

---

## 🗄️ MySQL2 — Phase 1 (Raw SQL)

> The following endpoints were built in Phase 1 using **MySQL2** with raw SQL queries. They remain in the codebase as a reference for the original implementation before migrating to Sequelize ORM.

---

### 🔑 Auth — `/auth` — MySQL2

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
{ "message": "User Created Successfully" }
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

### 👤 User — `/user` — MySQL2

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

### 📄 Blog — `/blog` — MySQL2

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
{ "message": "Blog Created Successfully" }
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
