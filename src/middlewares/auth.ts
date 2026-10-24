import { verifyToken } from "../modules/auth/auth.services";

import type { Request, Response, NextFunction } from "express";

async function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"] || "";
	const [scheme, token] = authHeader.split(" ");
	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({
			message: "Authentication Error: Access token missing or malformed",
		});
	}

	try {
		const payload = verifyToken(token);
		req.user = payload;
		next();
	} catch (error) {
		return res
			.status(403)
			.json({ message: "Authentication Error: Invalid access token" });
	}
}

export { authenticate };
