import { NextFunction, Request, Response } from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize-typescript";
import userService from "../services/userService.js";
import { StatusCodes } from "http-status-codes";
import { UserCreation, UserUpdate } from "../types/index.js";
import { z } from "zod";
import { CustomError } from "../errors/errorTypes.js";

async function getUser(req: Request, res: Response, next: NextFunction) {
	try {
		console.log("get user body");
		console.log(req.body);

		const { id } = req.params;
		const foundUser = await userService.getUser(Number(id));
		res.status(StatusCodes.OK).send(foundUser);
	} catch (err) {
		next(err);
	}
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
	const updateFields = UserUpdate.safeParse(req.body);
	const { id } = req.params;

	try {
		if (updateFields.success) {
			const updatedUser = await userService.updateUser(
				updateFields.data,
				Number(id)
			);
			console.log(updatedUser);
			res.status(StatusCodes.OK).send(updatedUser);
		} else {
			throw new CustomError(
				"Invalid body provided. Check API specs.",
				StatusCodes.BAD_REQUEST
			);
		}
	} catch (err) {
		next(err);
	}
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params;
	console.log("my id is " + id);

	try {
		await userService.deleteUser(Number(id));
		res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

export { getUser, updateUser, deleteUser };
