import jwt from "jsonwebtoken";
import config from "../utils/config";
import type { Tokenpayload } from "../utils/types";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = config.JWT_SECRET;

async function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"] || "";
	const [scheme, token] = authHeader.split(" ");

	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({
			message: "Authentication Error: Access token missing or malformed",
		});
	}

	try {
		req.user = jwt.verify(token, JWT_SECRET) as Tokenpayload;
		if (!req.user.id || !req.user.email) {
			return res.status(403).json({
				message: "Authentication Error: Invalid access token",
			});
		}
		next();
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("[Auth] verifyUserToken error:", message);
		return res
			.status(403)
			.json({ message: "Authentication Error: Invalid access token" });
	}
}

export { authenticate };
