import { Request, Response } from "express";
import prisma from "../config/prisma.js";

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

	res.status(201).json({
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