import { NextFunction, Request, Response } from "express";
import Item from "../models/itemModel.js";
import itemService from "../services/itemService.js";
import { StatusCodes } from "http-status-codes";
import { ItemAdd, ItemUpdate, ItemsFilter } from "../types/item.js";

async function getItem(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const item = await itemService.getItem(Number(id));
		return res.status(StatusCodes.OK).send(item);
	} catch (err) {
		next(err);
	}
}

async function getAllItems(req: Request, res: Response, next: NextFunction) {
	try {
		const itemsInput = ItemsFilter.safeParse(req.query);
		if (itemsInput.success) {
			const items = await itemService.getAllItems(
				Number(itemsInput.data.inventoryId),
				Number(itemsInput.data.storyId)
			);
			return res.status(StatusCodes.OK).send(items);
		}
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

export { getAllItems, getItem, addItem, updateItem, deleteItem };
