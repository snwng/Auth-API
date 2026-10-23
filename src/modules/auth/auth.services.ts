import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../utils/config";
import { Users } from "../../utils/db";
import { tokenPayloadSchema, jwtSchema } from "../../utils/validation";

import type { User, Tokenpayload, ExpiresIn } from "../../utils/types";

const JWT_SECRET = config.JWT_SECRET;
const SALT_ROUNDS = config.SALT_ROUNDS;

function generateToken(payload: Tokenpayload, time: ExpiresIn = "30m"): string {
	return jwt.sign(
		{ id: payload.id.toString(), email: payload.email },
		JWT_SECRET,
		{
			expiresIn: time,
		},
	);
}

async function generatehash(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

function verifyToken(token: any): Tokenpayload {
	const parsedToken = jwtSchema.parse(token);
	const payload = jwt.verify(parsedToken, JWT_SECRET);
	const parsedPayload = tokenPayloadSchema.parse(payload);
	return parsedPayload;
}

async function verifyCrid(email: string, password: string): Promise<User> {
	const user = Users.getByEmail(email);
	if (!user) {
		throw new Error("User not found");
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		throw new Error("Invalid password");
	}

	return user;
}

export { generateToken, generatehash, verifyToken, verifyCrid };
