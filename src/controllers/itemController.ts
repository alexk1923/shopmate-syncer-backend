import { NextFunction, Request, Response, query } from "express";
import Item from "../models/itemModel.js";
import itemService from "../services/itemService.js";
import { StatusCodes } from "http-status-codes";
import {
	ItemAdd,
	ItemUpdate,
	ItemsFilter,
	ItemsFilterType,
} from "../types/item.js";
import { CustomError } from "../errors/errorTypes.js";

async function getItem(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const item = await itemService.getItem(Number(id));
		return res.status(StatusCodes.OK).send(item);
	} catch (err) {
		next(err);
	}
}

async function getItemsByHouse(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let queryParams: ItemsFilterType = {
			houseId: Number(req.params.houseId),
		};

		if (req.query.storeId) {
			queryParams = { ...queryParams, storeId: Number(req.query.storeId) };
		}

		const itemsInput = ItemsFilter.safeParse(queryParams);

		if (itemsInput.success) {
			const items = await itemService.getAllItemsByHouse(queryParams);

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

async function getAllItems(req: Request, res: Response, next: NextFunction) {
	try {
		const page = Number(req.query.page) ?? null;
		const pageSize = Number(req.query.pageSize) ?? null;

		const items = await itemService.getAllItems({ page, pageSize });
		if (page && pageSize) {
			return res.status(StatusCodes.OK).send(items);
		}
		return res.status(StatusCodes.OK).send(items);
	} catch (err) {
		next(err);
	}
}

async function getAllFood(req: Request, res: Response, next: NextFunction) {
	try {
		let queryParams: ItemsFilterType = {
			houseId: Number(req.query.houseId),
		};

		if (req.query.storeId) {
			queryParams = { ...queryParams, storeId: Number(req.query.storeId) };
		}

		const itemsInput = ItemsFilter.safeParse(queryParams);

		if (itemsInput.success) {
			const foodList = await itemService.getAllFood(queryParams);
			return res.status(StatusCodes.OK).send(foodList);
		}
		throw new CustomError(
			"Invalid query params provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function addItem(req: Request, res: Response, next: NextFunction) {
	try {
		const itemInput = ItemAdd.safeParse(req.body);

		if (itemInput.success) {
			const createdItem = await itemService.addItem(itemInput.data);
			return res.status(StatusCodes.OK).send(createdItem);
		}

		console.log(itemInput.error);
		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
	try {
		const itemInput = ItemUpdate.safeParse(req.body);
		if (itemInput.success) {
			const { id } = req.params;
			const updatedItem = await itemService.updateItem(
				Number(id),
				itemInput.data
			);
			return res.status(StatusCodes.OK).send(updatedItem);
		}
		throw new CustomError(
			"Invalid body provided. Check API specs.",
			StatusCodes.BAD_REQUEST
		);
	} catch (err) {
		next(err);
	}
}

async function deleteItem(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		await itemService.deleteItem(Number(id));
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

export {
	getItemsByHouse,
	getAllFood,
	getItem,
	addItem,
	updateItem,
	deleteItem,
	getAllItems,
};
