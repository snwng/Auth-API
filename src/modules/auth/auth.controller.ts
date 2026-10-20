import { Users } from "../../utils/db";
import {
	generatehash,
	generateToken,
	verifyCrid,
	verifyToken,
} from "./auth.services";
import type { User, NewUser, Tokenpayload } from "../../utils/interfaces";
import type { Request, Response } from "express";

async function signUp(req: Request, res: Response) {
	try {
		const { email, password, firstName, lastName } = req.body || {};

		if (!email || !password || !firstName || !lastName) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const existingUser = Users.getByEmail(email);
		if (existingUser) {
			return res.status(409).json({ message: "Email already in use" });
		}

		const passwordhash = await generatehash(password);

		const user: NewUser = {
			email,
			password: passwordhash,
			firstName,
			lastName,
		};
		let { lastInsertRowid } = Users.addUser(user);
		const id = lastInsertRowid.toString();

		const payload = { id, email };
		const accessToken = generateToken(payload, "30m");
		const refreshToken = generateToken(payload, "7d");

		const id_bigint = BigInt(lastInsertRowid);
		Users.updateRefreshToken(id_bigint, refreshToken);

		return res.status(201).json({ accessToken, refreshToken });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function logIn(req: Request, res: Response) {
	try {
		const { email, password } = req.body || {};

		if (!email || !password) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		let user;
		try {
			user = await verifyCrid(email, password);
		} catch (error) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const id = user.id.toString();
		const payload: Tokenpayload = { id, email: user.email };
		const refreshToken = generateToken(payload, "7d");
		const accessToken = generateToken(payload, "30m");

		Users.updateRefreshToken(user.id, refreshToken);
		return res.status(200).json({ accessToken, refreshToken });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function refreshToken(req: Request, res: Response) {
	try {
		const { refreshToken } = req.body || {};

		if (!refreshToken) {
			return res.status(400).json({ message: "Missing refresh token" });
		}

		let payload: Tokenpayload;
		try {
			payload = verifyToken(refreshToken) as Tokenpayload;
		} catch (error) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const user = Users.getById(BigInt(payload.id));
		if (!user || user.refreshToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}
		const newAccessToken = generateToken(payload, "30m");
		const newRefreshToken = generateToken(payload, "7d");

		Users.updateRefreshToken(BigInt(payload.id), newRefreshToken);

		return res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function logOut(req: Request, res: Response) {
	try {
		const { id } = req.user as Tokenpayload;
		const id_bigint = BigInt(id);

		Users.updateRefreshToken(id_bigint, null);

		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export { signUp, logIn, refreshToken, logOut };
