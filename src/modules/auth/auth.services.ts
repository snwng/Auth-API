import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../utils/config";
import { Users } from "../../utils/db";
import type { User, Tokenpayload, ExpiresIn } from "../../utils/interfaces";

const JWT_SECRET = config.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

const SALT_ROUNDS = config.SALT_ROUNDS;

function createTokenPayload(id: bigint, email: string): Tokenpayload {
	return { id: id.toString(), email };
}

function generateToken(payload: Tokenpayload, time: ExpiresIn = "30m"): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: time,
	});
}

async function generatehash(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

function verifyToken(token: string): Tokenpayload {
	let payload: Tokenpayload;
	try {
		payload = jwt.verify(token, JWT_SECRET) as Tokenpayload;
	} catch (error) {
		throw new Error("Invalid token", { cause: error });
	}
	return payload;
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

export {
	createTokenPayload,
	generateToken,
	generatehash,
	verifyToken,
	verifyCrid,
};
