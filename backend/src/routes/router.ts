import { Router } from "express";
import { adminGuard, authGuard, getMe, login, logout, signup, validateBody } from "../controllers/auth.js";
import { loginSchema, singupSchema } from "../config/schemas.js";
import { allPosts, deletePost, newPost, post, updatePost } from "../controllers/posts.js";
import { comments, deleteComment, newComment } from "../controllers/comments.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/signup", validateBody(singupSchema), signup);
router.post("/logout", authGuard, logout)

router.get("/me", authGuard, getMe);

router.get("/posts", allPosts);
router.get("/posts/:id", post);
router.post("/posts", authGuard, adminGuard, newPost);
router.patch("/posts/:id", authGuard, adminGuard, updatePost);
router.delete("/posts/:id", authGuard, adminGuard, deletePost);

router.get("/posts/:id/comments", comments)
router.post("/posts/:id/comments", authGuard, newComment)
router.delete("/posts/:id/comments/:commentId", authGuard, deleteComment);

export default router;