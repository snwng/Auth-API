import { Users } from "../../utils/db";
import type { Tokenpayload } from "../../utils/types";
import type { Request, Response } from "express";

function getUser(req: Request, res: Response) {
	const { id } = req.user as Tokenpayload;

	const user = Users.getById(id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const {
		password,
		refreshToken,
		...userWithoutSensitiveInfo
	} = user;
	return res
		.status(200)
		.json({ ...userWithoutSensitiveInfo });
}

export { getUser };
