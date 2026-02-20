import { Pool } from "pg";
import ENV from "./secrets.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const pool = new Pool({connectionString: ENV.DATABASE_URL});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter: adapter,
});

export default prisma;