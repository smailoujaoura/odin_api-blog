function requireEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing env: ${key}`);
	}
	return value;
}

const ENV = {
	PORT: process.env.PORT || 3000,
	DATABASE_URL: requireEnv("DATABASE_URL"),
	JWT_SECRET: requireEnv("JWT_SECRET"),
	NODE_ENV: requireEnv("NODE_ENV"),
	ADMIN_KEY: requireEnv("ADMIN_KEY"),
	ORIGIN_ONE: requireEnv("ORIGIN_ONE"),
	ORIGIN_TWO: requireEnv("ORIGIN_TWO"),
};

export default ENV;