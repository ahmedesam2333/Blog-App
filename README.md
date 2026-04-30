<div align="center">

<h1>📝 BlogWave App</h1>
<p><strong>Full-Featured Blog Platform — REST API Backend</strong></p>

![Status](https://img.shields.io/badge/Status-In_Progress-f59e0b?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MySQL2](https://img.shields.io/badge/MySQL2-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-2D6A9F?style=for-the-badge&logo=sequelize&logoColor=white)

<br/>

> A secure, scalable backend system for a full-featured blog platform.  
> Users can create and manage posts, comment, like, and interact — with full auth, role-based access, and hardened API security.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Database Design](#%EF%B8%8F-database-design)
- [Features](#-features)
- [Project Structure](#%EF%B8%8F-project-structure)
- [API Documentation](#-api-documentation)
- [Author](#%E2%80%8D-author)

---

## 🧠 Overview

BlogWave is a content-driven blog platform where users can publish articles, engage with posts through comments and likes, and manage their own content. This repository contains the **full backend API** built with Node.js, Express.js, and MySQL via Sequelize ORM — featuring a security-first, layered architecture.

**Core concepts:**
- Users register, verify their email via OTP, and get a personal profile
- Authenticated users can create, update, and delete their own posts
- Posts can be organized by categories and tags
- Anyone can read posts; interactions (comments, likes) require authentication
- Admins can moderate content and manage users

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
- [x] MySQL database connection via Sequelize
- [x] Models & associations — User, Post, Comment, Category, Tag, Like
- [x] Sign Up & Login endpoints
- [x] Global error handling middleware
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

---

### 🔜 In Progress / Upcoming

- [ ] Create / update / delete posts
- [ ] Categories & tags management
- [ ] Comments — add, edit, delete, nested replies
- [ ] Likes — toggle like on posts and comments
- [ ] Public blog feed with search & pagination
- [ ] Public author profile page
- [ ] Soft delete for posts
- [ ] Admin dashboard — manage users, posts, comments

---

## 🗂️ Project Structure

```
BLOGWAVE-APP/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── post/
│   │   │   ├── post.controller.js
│   │   │   └── post.routes.js
│   │   ├── comment/
│   │   │   ├── comment.controller.js
│   │   │   └── comment.routes.js
│   │   ├── category/
│   │   │   ├── category.controller.js
│   │   │   └── category.routes.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       └── user.routes.js
│   ├── DB/
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── blog.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── category.model.js
│   │   │   ├── like.model.js
│   │   └── db.connection.js
│   ├── middleware/
│   │   ├── authentication.middleware.js
│   │   └── authorization.middleware.js
│   └── utils/
│       └── security/
│           ├── hash.security.js      (bcrypt generateHash + compareHash)
│   ├── app.controller.js             (main app setup / route mounting)
│   └── index.js                      (entry point)
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

## 👤 User — `/user` &nbsp; 🔒 *Protected*

<details>
<summary><strong>Routes</strong> — <em>user.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as userController from "./user.controller.js";
const router = express.Router();

router.get("/", userController.getAllUsers);

export default router;
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user</strong> — Get current user profile</summary>

<br/>

> 🔒 Protected — pass access token in `Authorization` header using `Bearer` (user) or `Admin` prefix.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "id": 1,
    "fullName": "Ahmed Essam",
    "email": "a1@example.com",
    "gender": "male",
    "bio": "Software engineer & blogger",
    "avatar": "https://cdn.example.com/avatars/ahmed.jpg",
    "role": "user",
    "postsCount": 12
  }
}
```

**Response `401` — Missing token parts:**
```json
{ "err_message": "Missing-Token-Parts" }
```

**Response `400` — Invalid token:**
```json
{ "err_message": "Invalid-Token" }
```

**Response `404` — User not found:**
```json
{ "err_message": "User Not Found" }
```

<details>
<summary><em>Controller code</em></summary>

```javascript
export const getProfile = asyncHandler(async (req, res, next) => {
  return successResponse({ res, data: req.user });
});
```

</details>

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/refresh-token</strong> — Get new access & refresh tokens</summary>

<br/>

> 🔒 Protected — pass **refresh token** in `Authorization` header.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "access_token": "<new_jwt_access_token>",
    "refresh_token": "<new_jwt_refresh_token>"
  }
}
```

<details>
<summary><em>Controller code</em></summary>

```javascript
export const getNewLoginCredentials = asyncHandler(async (req, res, next) => {
  const newCredentials = await generateLoginCredentials({ user: req.user });
  return successResponse({ res, status: 200, data: newCredentials });
});
```

</details>

</details>

---

<details>
<summary><code>PUT</code> &nbsp; <strong>/user</strong> — Update profile (name, bio, avatar) &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/user/:username</strong> — Get public author profile &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Displays the author's public profile with their published posts*  
> ⬜ *Add details when implemented*

</details>

---

## 📄 Posts — `/post` &nbsp; 🔒 *Protected (write)*

<details>
<summary><strong>Routes</strong> — <em>post.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as postController from "./post.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";
const router = express.Router();

router.get("/", postController.getAllPosts);                                          // public
router.get("/:id", postController.getPostById);                                      // public
router.post("/", authentication(), postController.createPost);                       // protected
router.put("/:id", authentication(), postController.updatePost);                     // protected
router.delete("/:id", authentication(), postController.deletePost);                  // protected

export default router;
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/post</strong> — Get all posts (feed) with pagination & search</summary>

<br/>

**Query Params:**
```
?page=1&limit=10&search=nodejs&categoryId=2&tagId=5
```

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Getting Started with Sequelize",
        "slug": "getting-started-with-sequelize",
        "excerpt": "A beginner-friendly guide...",
        "coverImage": "https://cdn.example.com/posts/cover.jpg",
        "author": { "id": 1, "fullName": "Ahmed Essam", "avatar": "..." },
        "category": { "id": 2, "name": "Backend" },
        "likesCount": 42,
        "commentsCount": 7,
        "createdAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/post/:id</strong> — Get a single post by ID</summary>

<br/>

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "id": 1,
    "title": "Getting Started with Sequelize",
    "slug": "getting-started-with-sequelize",
    "content": "Full markdown content...",
    "coverImage": "https://cdn.example.com/posts/cover.jpg",
    "author": { "id": 1, "fullName": "Ahmed Essam" },
    "category": { "id": 2, "name": "Backend" },
    "tags": [{ "id": 5, "name": "nodejs" }, { "id": 6, "name": "mysql" }],
    "likesCount": 42,
    "commentsCount": 7,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Response `404` — Post not found:**
```json
{ "err_message": "Post not found" }
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/post</strong> — Create a new post &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add request body, success response, and error cases when implemented*

</details>

---

<details>
<summary><code>PUT</code> &nbsp; <strong>/post/:id</strong> — Update a post &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/post/:id</strong> — Delete a post &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

## 💬 Comments — `/comment` &nbsp; 🔒 *Protected*

<details>
<summary><strong>Routes</strong> — <em>comment.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as commentController from "./comment.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";
const router = express.Router();

router.get("/post/:postId", commentController.getPostComments);                           // public
router.post("/post/:postId", authentication(), commentController.addComment);             // protected
router.put("/:id", authentication(), commentController.updateComment);                    // protected
router.delete("/:id", authentication(), commentController.deleteComment);                 // protected

export default router;
```

</details>

---

<details>
<summary><code>GET</code> &nbsp; <strong>/comment/post/:postId</strong> — Get all comments for a post</summary>

<br/>

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "Great article!",
        "author": { "id": 2, "fullName": "Sara Ali", "avatar": "..." },
        "createdAt": "2025-01-16T08:00:00.000Z"
      }
    ],
    "total": 7
  }
}
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/comment/post/:postId</strong> — Add a comment &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>PUT</code> &nbsp; <strong>/comment/:id</strong> — Edit a comment &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>DELETE</code> &nbsp; <strong>/comment/:id</strong> — Delete a comment &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

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
