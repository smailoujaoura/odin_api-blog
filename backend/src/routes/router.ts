import { Router } from "express";
import { authGuard, login, secure, signup, validateBody } from "../controllers/auth.js";
import { loginSchema, singupSchema } from "../config/schemas.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/signup", validateBody(singupSchema), signup)

router.get("/secure", authGuard, secure);

export default router;