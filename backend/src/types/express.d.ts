import { Role } from "../generated/prisma/enums.ts";

declare global {
	namespace Express {
		interface Request {
			userId?: number;
			userRole?: Role;
		}
	}
}

export {};