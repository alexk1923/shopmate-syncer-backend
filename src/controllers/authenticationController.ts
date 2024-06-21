import dotenv from "dotenv";
dotenv.config();
import jwt, { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserCredential from "../models/userCredentialModel.js";
import bcrypt from "bcrypt";
import { NotificationTokenUpdate, UserCreation } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import userService from "../services/userService.js";
import { CustomError } from "../errors/errorTypes.js";
import { v2 as cloudinary } from "cloudinary";
import { NotificationService } from "../services/notificationService.js";

const login = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		if (!process.env.TOKEN_KEY) {
			throw new Error("TOKEN_KEY is not defined");
		}

		let existingUser = null;
		console.log(req.body);

		if (username) {
			existingUser = await UserCredential.findOne({ where: { username } });
		}

		if (email) {
			existingUser = await UserCredential.findOne({ where: { email } });
		}

		console.log("my existing user");
		console.log(existingUser);

		if (
			existingUser &&
			(await bcrypt.compare(password, existingUser.password))
		) {
			const token = jwt.sign(
				{ userId: existingUser.id, email },
				process.env.TOKEN_KEY as Secret,
				{
					expiresIn: "1 day",
				}
			);

			return res.status(200).send({
				id: existingUser.id,
				email: existingUser.email,
				username: existingUser.username,
				token: token,
				// more properties can be added
			});
		}

		return res
			.status(400)
			.json({ message: "Wrong credentials. Please try again" });
	} catch (err) {
		console.log(err);
	}
};

async function register(req: Request, res: Response, next: NextFunction) {
	try {
		const userRegisterData = UserCreation.safeParse(req.body);

		if (userRegisterData.success) {
			const user = await userService.createUser(userRegisterData.data);
			res.status(StatusCodes.CREATED).send(user);
		} else {
			console.log(userRegisterData.error.errors);
			throw new CustomError(
				"Invalid body provided. Check API specs.",
				StatusCodes.BAD_REQUEST
			);
		}
	} catch (err) {
		next(err);
	}
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	res.status(StatusCodes.OK).send({ authorization: true });
}

async function updateNotificationToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const userUpdatedCredentials = NotificationTokenUpdate.safeParse(req.body);
		const { userId } = req.params;

		if (userUpdatedCredentials.success) {
			const user = await NotificationService.updateNotificationToken(
				Number(userId),
				userUpdatedCredentials.data.notificationToken
			);
			console.log("updated user:");
			console.log(user);
			res.status(StatusCodes.CREATED).send({
				message: `Updated notification token = ${user.notificationToken} for user with id = ${user.id}`,
			});
		} else {
			console.log(userUpdatedCredentials.error.errors);
			throw new CustomError(
				"Invalid body provided. Check API specs.",
				StatusCodes.BAD_REQUEST
			);
		}
	} catch (err) {
		next(err);
	}
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(req: Request, res: Response, next: NextFunction) {
	const { image } = req.body;

	cloudinary.uploader
		.upload(image, { upload_preset: "shopmate-syncer-upload" })
		.then((uploadRes) => {
			// console.log(uploadRes);
			res.status(StatusCodes.OK).send(uploadRes);
		})
		.catch((err) => {
			console.log("It had an error");
			// console.log(err);
			next(err);
		});
}

export { login, register, verifyToken, uploadImage, updateNotificationToken };
