import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";
import ENV from "../config/secrets.js";

export class CustomError extends Error {
	public status: number;
	public message: string;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.message = message;

		Object.setPrototypeOf(this, CustomError.prototype);
	}
}

export const errorsHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof CustomError) {

		logger.debug(`${error}`);

		return res.status(error.status).json({
			success: false,
			status: error.status,
			message: error.message
		})
	}

	logger.error(`Unhandeled error: ${error}`);

	return res.status(500).json({
		success: false,
		status: 500,
		message: ENV.NODE_ENV == "development" ? error.stack : "Something went wrong on our end."
	})
}
