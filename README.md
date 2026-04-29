<div align="center">

<h1>📝 BlogWave App</h1>
<p><strong>Full-Featured Blog Platform — REST API Backend</strong></p>

![Status](https://img.shields.io/badge/Status-In_Progress-f59e0b?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
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
- Image uploads supported for post covers and user avatars

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
- [x] Async error handler utility (`asyncHandler`)
- [x] Global error handling middleware
- [x] Uniform success/error API response structure (`response.js`)
- [x] Environment variables setup (`dotenv`)

<details>
<summary><strong>🛠️ asyncHandler + successResponse + globalErrorHandling</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => {
      error.cause = 500;
      return next(error);
    });
  };
};

export const successResponse = ({
  res,
  message = "Done",
  status = 200,
  data,
}) => {
  return res.status(status).json({ message, data });
};

export const globalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.cause || 400)
    .json({ err_message: error.message, stack: error.stack });
};
```

</details>

- [x] DB Service layer — generalized Sequelize-agnostic data access methods

<details>
<summary><strong>🗄️ DB Service</strong> — <em>Click to see example</em></summary>

<br/>

```javascript
export const findOne = async ({
  model,
  filter = {},
  attributes,
  include = [],
} = {}) => {
  return await model.findOne({ where: filter, attributes, include });
};

export const findById = async ({
  model,
  id,
  attributes,
  include = [],
} = {}) => {
  return await model.findByPk(id, { attributes, include });
};

export const create = async ({ model, data = {} } = {}) => {
  return await model.create(data);
};

export const findByIdAndUpdate = async ({
  model,
  id,
  updatedData = {},
} = {}) => {
  await model.update(updatedData, { where: { id } });
  return await model.findByPk(id);
};

export const findAll = async ({
  model,
  filter = {},
  attributes,
  include = [],
  limit,
  offset,
  order = [["createdAt", "DESC"]],
} = {}) => {
  return await model.findAndCountAll({
    where: filter,
    attributes,
    include,
    limit,
    offset,
    order,
  });
};
```

</details>

- [x] Hashing — `bcrypt` implementation for passwords (`src/utils/security/hash.security.js`)

<details>
<summary><strong>🔒 Hashing — bcrypt</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
import bcrypt from "bcryptjs";

export const generateHash = async ({ plainText = "", salt = 12 }) => {
  const hash = bcrypt.hashSync(plainText, parseInt(salt));
  return hash;
};

export const compareHash = async ({ plainText = "", hashedPassword = "" }) => {
  const match = bcrypt.compareSync(plainText, hashedPassword);
  return match;
};
```

</details>

- [x] JWT — Role-aware token system with Bearer/Admin signature levels, `decodeToken`, and `generateLoginCredentials` (`src/utils/security/token.security.js`)

<details>
<summary><strong>🪙 JWT Tokens</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
import jwt from "jsonwebtoken";
import { User } from "../../DB/models/index.js";
import * as DBService from "../../DB/db.service.js";

export const signatureLevelEnum = { bearer: "Bearer", admin: "Admin" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };

export const genAccessToken = async ({
  payload = {},
  signature = process.env.JWT_ACCESS_USER_KEY,
  options = { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
} = {}) => {
  return jwt.sign(payload, signature, options);
};

export const genRefreshToken = async ({
  payload = {},
  signature = process.env.JWT_REFRESH_USER_KEY,
  options = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
} = {}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = async ({
  token = "",
  signature = process.env.JWT_REFRESH_USER_KEY,
} = {}) => {
  return jwt.verify(token, signature);
};

export const getSignatures = async ({
  signatureLevel = signatureLevelEnum.bearer,
} = {}) => {
  let signatures = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case signatureLevelEnum.admin:
      signatures.accessSignature = process.env.JWT_ACCESS_ADMIN_KEY;
      signatures.refreshSignature = process.env.JWT_REFRESH_ADMIN_KEY;
      break;
    default:
      signatures.accessSignature = process.env.JWT_ACCESS_USER_KEY;
      signatures.refreshSignature = process.env.JWT_REFRESH_USER_KEY;
  }
  return signatures;
};

export const decodeToken = async ({
  next,
  authorization = "",
  tokenType = tokenTypeEnum.access,
} = {}) => {
  const [Bearer, token] = authorization?.split(" ") || [];
  if (!Bearer || !token)
    return next(new Error("Missing-Token-Parts", { cause: 401 }));
  let signatures = await getSignatures({ signatureLevel: Bearer });
  const decoded = await verifyToken({
    token,
    signature:
      tokenType === tokenTypeEnum.access
        ? signatures.accessSignature
        : signatures.refreshSignature,
  });
  if (!decoded?.id) return next(new Error("Invalid-Token", { cause: 400 }));
  const user = await DBService.findById({ model: User, id: decoded.id });
  if (!user) return next(new Error("User Not Found", { cause: 404 }));
  return user;
};

export const generateLoginCredentials = async ({ user } = {}) => {
  let signatures = await getSignatures({
    signatureLevel:
      user.role !== "user"
        ? signatureLevelEnum.admin
        : signatureLevelEnum.bearer,
  });
  const access_token = await genAccessToken({
    payload: { id: user.id },
    signature: signatures.accessSignature,
  });
  const refresh_token = await genRefreshToken({
    payload: { id: user.id },
    signature: signatures.refreshSignature,
  });
  return { access_token, refresh_token };
};
```

</details>

- [x] Authentication middleware — decodes Bearer/Admin token, supports access & refresh token types (`src/middleware/authentication.middleware.js`)

<details>
<summary><strong>🛡️ Authentication Middleware</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
import { asyncHandler } from "../utils/response.js";
import {
  decodeToken,
  tokenTypeEnum,
} from "../utils/security/token.security.js";

export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
  return asyncHandler(async (req, res, next) => {
    req.user = await decodeToken({
      next,
      authorization: req.headers?.authorization,
      tokenType,
    });
    return next();
  });
};
```

</details>

- [x] Authorization middleware — role-based access control (`src/middleware/authorization.middleware.js`)

<details>
<summary><strong>🔐 Authorization Middleware</strong> — <em>Click to see implementation</em></summary>

<br/>

```javascript
import { asyncHandler } from "../utils/response.js";

export const authorization = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("Unauthorized — Insufficient permissions", { cause: 403 }));
    }
    return next();
  });
};
```

</details>

---

### 🔜 In Progress / Upcoming

- [ ] OTP email verification (`nodemailer`)
- [ ] Rate limiting per IP (`express-rate-limit`)
- [ ] Helmet security headers
- [ ] CORS configuration
- [ ] Joi request validation on all routes
- [ ] Multer file upload (post cover image & user avatar)
- [ ] Cloudinary integration for image hosting
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
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.routes.js
│   ├── DB/
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── post.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── category.model.js
│   │   │   ├── tag.model.js
│   │   │   ├── like.model.js
│   │   │   └── index.js              (associations + Sequelize init)
│   │   ├── db.service.js             (findOne, findById, findAll, create, findByIdAndUpdate)
│   │   └── connection.js
│   ├── middleware/
│   │   ├── authentication.middleware.js
│   │   └── authorization.middleware.js
│   ├── post/
│   │   ├── post.controller.js
│   │   └── post.routes.js
│   ├── comment/
│   │   ├── comment.controller.js
│   │   └── comment.routes.js
│   ├── category/
│   │   ├── category.controller.js
│   │   └── category.routes.js
│   ├── user/
│   │   ├── user.controller.js
│   │   └── user.routes.js
│   └── utils/
│   │   ├── response.js               (asyncHandler + success/error helpers + Global Error Handling)
│   │   └── security/
│   │       ├── hash.security.js      (bcrypt generateHash + compareHash)
│   │       └── token.security.js     (JWT gen/verify tokens + decodeToken + generateLoginCredentials + role-aware signatures)
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
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/signup</strong> — Register a new user</summary>

<br/>

**Request Body:**
```json
{
  "fullName": "Ahmed Essam",
  "email": "a1@example.com",
  "password": "StrongPass@123",
  "gender": "male"
}
```

**Response `201` — Success:**
```json
{
  "message": "User created successfully. Please verify your email.",
  "data": {
    "user": {
      "id": 1,
      "fullName": "Ahmed Essam",
      "email": "a1@example.com",
      "gender": "male",
      "role": "user",
      "isVerified": false
    }
  }
}
```

**Response `409` — Email already exists:**
```json
{ "err_message": "Email already exists" }
```

<details>
<summary><em>Controller code</em></summary>

```javascript
export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, gender } = req.body;
  if (await DBService.findOne({ model: User, filter: { email } })) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
  const hashedPassword = await generateHash({ plainText: password });
  const user = await DBService.create({
    model: User,
    data: { fullName, email, password: hashedPassword, gender },
  });
  // TODO: send OTP email
  return successResponse({
    res,
    message: "User created successfully. Please verify your email.",
    status: 201,
    data: { user },
  });
});
```

</details>

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/login</strong> — Login with credentials</summary>

<br/>

**Request Body:**
```json
{
  "email": "a1@example.com",
  "password": "StrongPass@123"
}
```

**Response `200` — Success** *(message adapts based on role)*:
```json
{
  "message": "User Logged in successfully",
  "data": {
    "access_token": "<jwt_access_token>",
    "refresh_token": "<jwt_refresh_token>"
  }
}
```

**Response `403` — Email not verified:**
```json
{ "err_message": "Please verify your email before logging in" }
```

**Response `404` — Invalid credentials:**
```json
{ "err_message": "Invalid email or password" }
```

<details>
<summary><em>Controller code</em></summary>

```javascript
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBService.findOne({ model: User, filter: { email } });
  if (!user) return next(new Error("Invalid email or password", { cause: 404 }));
  const match = await compareHash({ plainText: password, hashedPassword: user.password });
  if (!match) return next(new Error("Invalid email or password", { cause: 404 }));
  if (!user.isVerified) return next(new Error("Please verify your email before logging in", { cause: 403 }));
  const credentials = await generateLoginCredentials({ user });
  return successResponse({
    res,
    status: 200,
    message: `${user.role === "user" ? "User" : "Admin"} Logged in successfully`,
    data: credentials,
  });
});
```

</details>

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/verify-otp</strong> — Verify email with OTP &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add request body, success response, and error cases when implemented*

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/resend-otp</strong> — Resend OTP to email &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/forgot-password</strong> — Send password reset email &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/auth/reset-password</strong> — Reset password using token &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

## 👤 User — `/user` &nbsp; 🔒 *Protected*

<details>
<summary><strong>Routes</strong> — <em>user.routes.js</em></summary>

<br/>

```javascript
import express from "express";
import * as userController from "./user.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../utils/security/token.security.js";
const router = express.Router();

router.get("/", authentication(), userController.getProfile);
router.get(
  "/refresh-token",
  authentication({ tokenType: tokenTypeEnum.refresh }),
  userController.getNewLoginCredentials
);
router.put("/", authentication(), userController.updateProfile);
router.get("/:username", userController.getPublicProfile);

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

## ❤️ Likes — `/like` &nbsp; 🔒 *Protected*

<details>
<summary><code>POST</code> &nbsp; <strong>/like/post/:postId</strong> — Toggle like on a post &nbsp; ⬜ <em>Not yet implemented</em></summary>

<br/>

> ⬜ *Add details when implemented*

</details>

---

## 🗂️ Categories — `/category`

<details>
<summary><code>GET</code> &nbsp; <strong>/category</strong> — Get all categories</summary>

<br/>

**Response `200` — Success:**
```json
{
  "message": "Done",
  "data": {
    "categories": [
      { "id": 1, "name": "Technology", "postsCount": 34 },
      { "id": 2, "name": "Backend", "postsCount": 18 }
    ]
  }
}
```

</details>

---

<details>
<summary><code>POST</code> &nbsp; <strong>/category</strong> — Create a category &nbsp; 🔒 Admin only &nbsp; ⬜ <em>Not yet implemented</em></summary>

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
