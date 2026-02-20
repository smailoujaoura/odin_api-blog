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
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		throw new CustomError(Errors.UNAUTHORIZED, "Missing authentication token.");
	}

	const token = authHeader.split(" ")[1];
	const payload = verifyToken(token) as { sub: string };

	req.userId = +payload.sub;
	next();
}

export const login = async (req: Request, res: Response) => {
	const {email, password} = req.body;

	const user = await prisma.user.findUnique({where: {email}});
	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new CustomError(Errors.INVALID_CREDENTIALS)
	}

	const token = generateToken(user.id);
	res.json({
		success: true,
		token
	})

	// res.send("GOOD");
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

	const token = generateToken(user.id);
	res.status(201).json({
		success: true,
		token,
		user: {
			id: user.id,
			name: user.name
		}
	})

	// const {password: _, ...safeUser} = user;
	// res.status(201).json(safeUser);
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