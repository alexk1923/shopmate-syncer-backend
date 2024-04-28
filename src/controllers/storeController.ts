import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import storeService from "../services/storeService.js";
import { StoreAdd, StoreUpdate } from "../types/store.js";
import { CustomError } from "../errors/errorTypes.js";

async function getAllStores(req: Request, res: Response, next: NextFunction) {
	try {
		const stores = await storeService.getAllStores();
		return res.status(StatusCodes.OK).send(stores);
	} catch (err) {
		next(err);
	}
}

async function getStore(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;

		const item = await storeService.getStore(Number(id));
		return res.status(StatusCodes.OK).send(item);
	} catch (err) {
		next(err);
	}
}

async function addStore(req: Request, res: Response, next: NextFunction) {
	try {
		const storeInput = StoreAdd.safeParse(req.body);
		if (storeInput.success) {
			const createdItem = await storeService.addStore(storeInput.data);
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

async function updateStore(req: Request, res: Response, next: NextFunction) {
	try {
		const storeInput = StoreUpdate.safeParse(req.body);
		if (storeInput.success) {
			const { id } = req.params;
			const updatedItem = await storeService.updateStore(
				Number(id),
				storeInput.data
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

async function deleteStore(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		await storeService.deleteStore(Number(id));
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

export { addStore, updateStore, getStore, getAllStores, deleteStore };
