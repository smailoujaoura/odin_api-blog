import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/errors.js";

export const login = (req: Request, res: Response, next: NextFunction) => {
	// return next(new CustomError(401, "not found"));
	// res.send("hello");
}
