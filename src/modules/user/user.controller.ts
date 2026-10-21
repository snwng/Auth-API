import { Users } from "../../utils/db";
import type { Tokenpayload, User } from "../../utils/types";
import type { Request, Response } from "express";

function getUser(req: Request, res: Response) {

	const { id } = req.user as Tokenpayload;
	const userId = BigInt(id);
	const user = Users.getById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const { password, refreshToken, id: userIdBigInt , ...userWithoutSensitiveInfo } = user;
	return res.status(200).json({id ,...userWithoutSensitiveInfo});
}

export { getUser };
