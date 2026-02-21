import { Router } from "express";
import { admin, adminGuard, authGuard, getMe, login, logout, secure, signup, validateBody } from "../controllers/auth.js";
import { loginSchema, singupSchema } from "../config/schemas.js";
import { allPosts, comments, deletePost, newPost, post, updatePost } from "../controllers/posts.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/signup", validateBody(singupSchema), signup);
router.post("/logout", authGuard, logout)

router.get("/secure", authGuard, secure);
router.get("/admin", authGuard, adminGuard, admin)

router.get("/me", authGuard, getMe);

router.get("/posts", allPosts);
router.get("/posts/:id", post);
router.post("/posts", authGuard, adminGuard, newPost);
router.patch("/posts/:id", authGuard, adminGuard, updatePost);
router.delete("/posts/:id", authGuard, adminGuard, deletePost);

router.get("/posts/:id/comments", comments)



export default router;