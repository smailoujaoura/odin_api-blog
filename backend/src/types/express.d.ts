import { User } from "../generated/prisma/client.ts";
import { Role } from "../generated/prisma/enums.ts";

declare global {
	namespace Express {
		interface Request {
			user?: Omit<User, 'password'>;
		}
	}
}

export {};