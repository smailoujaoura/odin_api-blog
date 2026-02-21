import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { CustomError, Errors } from "../middlewares/errors.js";

export const newPost = async (req: Request, res: Response) => {
	const {title, content, published} = req.body;

	const post = await prisma.post.create({
		data: {
			title,
			content,
			published: published || false,
			user: {
				connect: {id: req.user?.id}
			}
		}
	});

	if (!post) {
		throw new CustomError(Errors.NOT_FOUND, "Post not found.");
	}

	res.status(201).json({
		success: true,
		post
	});
}

export const updatePost = async (req: Request, res: Response) => {
	const {title, content, published} = req.body;
	const { id } = req.params;

	const post = await prisma.post.update({
		where: {id: +id},
		data: {
			title,
			content,
			published
		}
	});

	if (!post) {
		throw new CustomError(Errors.NOT_FOUND, "Post not found.");
	}

	res.json({
		success: true,
		post
	});
}

export const allPosts = async (req: Request, res: Response) => {
	const posts = await prisma.post.findMany();

	res.json({
		success: true,
		posts
	})
}

export const post = async (req: Request, res: Response) => {
	const {id} = req.params;

	const post = await prisma.post.findFirst({
		where: {
			id: Number(id),
		}
	});

	if (!post) {
		throw new CustomError(Errors.NOT_FOUND, "Post not found.");
	}

	res.json({
		success: true,
		post
	});
}

export const deletePost = async (req: Request, res: Response) => {
	const {id} = req.params;

	await prisma.post.delete({
		where: {
			id: +id,
		}
	});

	

	res.json({
		success: true,
		message: "Post deleted.",
	})
}

export const comments = async (req: Request, res: Response) => {
	const {id} = req.params;

	const data = await prisma.post.findUnique({
		where: { id: Number(id) },
		include: {
			comments: {
				include: { user: { select: { name: true } } }
			}
		}
	});

	if (!data) {
		throw new CustomError(Errors.NOT_FOUND, "Post not found.");
	}

	res.json({ 
		success: true, 
		comments: data.comments
	});
}