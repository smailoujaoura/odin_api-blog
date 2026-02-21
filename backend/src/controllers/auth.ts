import type { NextFunction, Request, Response } from "express";
import { CustomError, Errors } from "../middlewares/errors.js";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import ENV from "../config/secrets.js";
import z from "zod";

export const generateToken = (userId: number): string => {
	return jwt.sign(
		{
			sub: userId.toString(),
		},
		ENV.JWT_SECRET,
		{
			expiresIn: "1h"
		}
	);
}

export const verifyToken = (token: string): JwtPayload => {
	try {
		return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
	} catch (err) {
		throw new CustomError(Errors.UNAUTHORIZED, "Invalid or expired token.")
	}
}

export const secure = (req: Request, res: Response) => {
	res.send("ACCESSED SECURE!!!");
}

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.token;
	if (!token) {
		throw new CustomError(Errors.UNAUTHORIZED, "No session found.");
	}
	
	const payload = verifyToken(token) as { sub: string };
	req.userId = +payload.sub;
	next();
}

const sendToken = (res: Response, userId: number, statusCode: number) => {
	const token = generateToken(userId);

	res.status(statusCode).cookie("token", token, {
		httpOnly: true,
		secure: ENV.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 1000 * 60 * 60,
		path: "/",
	}).json({
		success: true,
		message: statusCode === 201 ? "Account created." : "Logged in",
	});
}

export const login = async (req: Request, res: Response) => {
	const {email, password} = req.body;

	const user = await prisma.user.findUnique({where: {email}});
	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new CustomError(Errors.INVALID_CREDENTIALS)
	}

	sendToken(res, user.id, 200);
}

export const signup = async (req: Request, res: Response) => {
	const {name, email, password} = req.body;

	const existingUser = await prisma.user.findUnique({where: {email}});
	if (existingUser) {
		throw new CustomError(Errors.EMAIL_ALREADY_EXISTS);
	}

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: await bcrypt.hash(password, 10),
		}
	});

	sendToken(res, user.id, 201);
}

export const logout = (req: Request, res: Response) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: ENV.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	res.status(200).json({
		succes: true,
		message: "Logged out.",
	})
}

// parser middleware which accepts a zod generic schema and parses body according to that schema replacing the body in the req object or raising an error.
export const validateBody = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const parsed = schema.safeParse(req.body);
		if (!parsed.success) {
			const errorMessages = parsed.error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("; ");
			throw new CustomError(Errors.INVALID_ENTITY, errorMessages);
		}

		req.body = parsed.data;
		next();
	}
}