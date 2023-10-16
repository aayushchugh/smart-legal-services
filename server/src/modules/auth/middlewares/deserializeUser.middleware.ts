import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import authTokenUtil from "../utilities/authToken.util";
import prisma from "../../../common/database/prisma";

class DeserializeUserMiddleware implements NestMiddleware {
	constructor(private readonly authTokensUtil: authTokenUtil) {}

	async use(req: Request, res: Response, next: NextFunction) {
		// check if access token is provided
		if (!req.headers.authorization) {
			throw new UnauthorizedException("Access token is required");
		}

		// check if access token is valid
		const token = req.headers.authorization.replace(/^Bearer\s+/, "");

		// verify if token is valid
		const decodedToken = await this.authTokensUtil.verifyAccessToken(token);

		if (!decodedToken) {
			throw new UnauthorizedException("Invalid access token");
		}

		// get user from database
		const user = await prisma.user.findUnique({
			where: {
				id: decodedToken.userId,
			},
		});

		if (!user) {
			throw new UnauthorizedException("Invalid access token");
		}

		// attach user to request
		res.locals.user = user;

		next();
	}
}

export default DeserializeUserMiddleware;
