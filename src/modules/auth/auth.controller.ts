import { Users } from "../../utils/db";
import {
	generatehash,
	generateToken,
	verifyCrid,
	verifyToken,
} from "./auth.services";
import { signUpSchema, logInSchema } from "../../utils/validation";

import type { NewUser, Tokenpayload } from "../../utils/types";
import type { Request, Response } from "express";

async function signUp(req: Request, res: Response) {
	try {
		const signUpInfo = req.body || {};
		const parsedInfo = signUpSchema.safeParse(signUpInfo);
		if (!parsedInfo.success) {
			return res.status(400).json({
				message: "Invalid request body",
				errors: parsedInfo.error.issues,
			});
		}
		const { email, password, firstName, lastName } = parsedInfo.data;

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
		let { lastInsertRowid } = Users.add(user);

		const payload = { id: BigInt(lastInsertRowid), email };
		const accessToken = generateToken(payload, "30m");
		const refreshToken = generateToken(payload, "7d");
		const userId = BigInt(lastInsertRowid);
		Users.updateRefreshToken(userId, refreshToken);

		return res.status(201).json({ accessToken, refreshToken });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function logIn(req: Request, res: Response) {
	try {
		const logInInfo = req.body || {};
		const parsedInfo = logInSchema.safeParse(logInInfo);
		if (!parsedInfo.success) {
			return res.status(400).json({
				message: "Invalid request body",
				errors: parsedInfo.error.issues,
			});
		}
		const { email, password } = parsedInfo.data;

		let user;
		try {
			user = await verifyCrid(email, password);
		} catch (error) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const payload = { id: user.id, email } as Tokenpayload;
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

		let payload: Tokenpayload;
		try {
			payload = verifyToken(refreshToken);
		} catch (error) {
			console.log(refreshToken)
			console.error(error);
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		let userId = payload.id;
		const user = Users.getById(userId);
		if (!user || user.refreshToken !== refreshToken) {
			console.error("Refresh token mismatch or user not found");
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const freshPayload: Tokenpayload = { id: userId, email: user.email };
		const newAccessToken = generateToken(freshPayload, "30m");
		const newRefreshToken = generateToken(freshPayload, "7d");
		Users.updateRefreshToken(userId, newRefreshToken);

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
		Users.updateRefreshToken(id, null);

		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export { signUp, logIn, refreshToken, logOut };
