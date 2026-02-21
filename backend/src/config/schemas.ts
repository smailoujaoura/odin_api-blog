import { z } from "zod";

export const singupSchema = z.object({
	name: z.string().min(2, "Name too short"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	admin: z.string().optional()
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters")
})