import "dotenv/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

const config = {
	PORT: process.env.PORT || 5000,
	JWT_SECRET: required("JWT_SECRET"),
	DB_PATH: required("DB_PATH"),
	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "10") || 10,
};

export default config;
