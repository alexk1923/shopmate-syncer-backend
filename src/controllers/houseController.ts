import { NextFunction, Request, Response } from "express";
import houseService from "../services/houseService.js";
import { CustomError } from "../errors/errorTypes.js";
import { StatusCodes } from "http-status-codes";
import { HouseAddMember, HouseCreation, HouseUpdate } from "../types/index.js";

async function getHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const house = await houseService.getHouse(Number(id));
		res.status(StatusCodes.OK).send(house);
	} catch (err) {
		next(err);
	}
}

async function createHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const houseCreation = HouseCreation.safeParse(req.body);
		if (houseCreation.success) {
			const { name, defaultMembers } = houseCreation.data;
			if (!name) {
				throw new CustomError(
					"Invalid body, name not provided.",
					StatusCodes.BAD_REQUEST
				);
			}
			if (defaultMembers.length == 0) {
				throw new CustomError(
					"No default members provided.",
					StatusCodes.BAD_REQUEST
				);
			}
			const house = await houseService.createHouse(name, defaultMembers);
			return res.status(StatusCodes.CREATED).send(house);
		}

		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function updateHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const updateHouse = HouseUpdate.safeParse(req.body);
		if (updateHouse.success) {
			const { name } = updateHouse.data;
			if (!name) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.send({ message: "No name provided. No update has been made." });
			}
			const house = await houseService.updateHouse(Number(id), name);
			return res.status(StatusCodes.OK).send(house);
		}
		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function deleteHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		await houseService.deleteHouse(Number(id));
		res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

async function addUserToHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const addUser = HouseAddMember.safeParse(req.body);
		if (addUser.success) {
			const { userId } = addUser.data;
			const house = await houseService.addUserToHouse(Number(id), userId);
			return res.status(StatusCodes.OK).send(house);
		}
		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function removeUserFromHouse(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id, memberId } = req.params;

		const house = await houseService.removeUserFromHouse(
			Number(id),
			Number(memberId)
		);
		res.status(StatusCodes.OK).send(house);
	} catch (err) {
		next(err);
	}
}

export {
	getHouse,
	createHouse,
	updateHouse,
	deleteHouse,
	addUserToHouse,
	removeUserFromHouse,
};
