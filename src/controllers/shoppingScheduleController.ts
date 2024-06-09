import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import shoppingScheduleService from "../services/shoppingScheduleService.js";
import { CustomError } from "../errors/errorTypes.js";
import {
	ShoppingFilter,
	ShoppingFilterType,
	ShoppingScheduleAdd,
} from "../types/shoppingSchedule.js";

async function getShoppingScheduleList(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let queryParams: ShoppingFilterType = {
			houseId: Number(req.query.houseId),
		};

		const shoppingScheduleListInput = ShoppingFilter.safeParse(queryParams);

		if (shoppingScheduleListInput.success) {
			const items = await shoppingScheduleService.getShoppingScheduleList(
				queryParams
			);
			return res.status(StatusCodes.OK).send(items);
		}
		throw new CustomError(
			"Invalid query params provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function addShoppingSchedule(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const shoppingScheduleInput = ShoppingScheduleAdd.safeParse(req.body);
		if (shoppingScheduleInput.success) {
			const createdItem = await shoppingScheduleService.addShoppingSchedule(
				shoppingScheduleInput.data
			);
			return res.status(StatusCodes.OK).send(createdItem);
		}
		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

function updateShoppingList(req: Request, res: Response) {}

async function deleteShoppingList(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		await shoppingScheduleService.removeShoppingSchedule(Number(id));
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

export {
	getShoppingScheduleList,
	addShoppingSchedule,
	updateShoppingList,
	deleteShoppingList,
};
