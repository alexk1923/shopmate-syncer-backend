import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/errorTypes.js";
import { StatusCodes } from "http-status-codes";
import { decode } from "punycode";

function auth(req: Request, res: Response, next: NextFunction) {
	if (req.headers && req.headers.authorization) {
		console.log("");

		console.log(req.headers.authorization);

		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw new CustomError("No token provided.", StatusCodes.UNAUTHORIZED);
		}

		try {
			const decoded = jwt.verify(token, process.env.TOKEN_KEY as Secret);
			req.body.authUserId = (decoded as JwtPayload & { userId: string }).userId;
		} catch (err) {
			throw new CustomError(
				"Invalid or expired token.",
				StatusCodes.UNAUTHORIZED
			);
		}

		return next();
	} else {
		throw new CustomError("No token provided.", StatusCodes.UNAUTHORIZED);
	}
}

export { auth };
