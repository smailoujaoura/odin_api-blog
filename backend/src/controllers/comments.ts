import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { CustomError, Errors } from "../middlewares/errors.js";
import logger from "../config/logger.js";
import { Role } from "../generated/prisma/enums.js";

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

	logger.debug(comments);

	res.json({ 
		success: true, 
		comments: data.comments
	});
}

export const newComment = async (req: Request, res: Response) => {
	const { content } = req.body;
	const { id } = req.params;

	const comment = await prisma.comment.create({
		data: {
			content,
			post: { connect: { id: +id } },
			user: { connect: { id: req.user?.id } }
		},
		include: {
			user: {
				select: { name: true }
			}
		}
	});

	if (!comment) {
		throw new CustomError(Errors.BAD_REQUEST);
	}

	res.json({ 
		success: true,
		message: "Comment added.",
		comment,
	});
}

export const deleteComment = async (req: Request, res: Response) => {
	const { id, commentId } = req.params;

	const deleteCriteria: any = {
		id: +commentId,
		postId: +id,
	};

	if (req.user?.role !== Role.ADMIN) {
		deleteCriteria.userId = req.user?.id;
	}

	try {
		await prisma.comment.delete({
			where: deleteCriteria
		});

		res.json({ success: true, message: "Comment deleted." });
	} catch (error) {
		throw new CustomError(Errors.NOT_FOUND, "Comment not found or unauthorized.");
	}
}