import jwt from "jsonwebtoken";
import config from "../utils/config";
import { tokenPayloadSchema, jwtSchema } from "../utils/validation";
import type { Tokenpayload } from "../utils/types";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = config.JWT_SECRET;

async function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"] || "";
	const [scheme, token] = authHeader.split(" ");
	const parsedToken = jwtSchema.safeParse(token);
	if (scheme !== "Bearer" || !parsedToken.success) {
		return res.status(401).json({
			message: "Authentication Error: Access token missing or malformed",
		});
	}

	try {
		const payload = jwt.verify(parsedToken.data, JWT_SECRET);
		const parsedPayload = tokenPayloadSchema.safeParse(payload);

		if (!parsedPayload.success) {
			return res
				.status(403)
				.json({
					message: "Authentication Error: Invalid access token",
				});
		}

		req.user = parsedPayload.data as Tokenpayload;
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
