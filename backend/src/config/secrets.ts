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
	NODE_ENV: requireEnv("NODE_ENV")
};

export default ENV;