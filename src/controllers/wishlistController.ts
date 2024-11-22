import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import storeService from "../services/storeService.js";
import { StoreAdd, StoreUpdate } from "../types/store.js";
import { CustomError } from "../errors/errorTypes.js";
import wishlistService from "../services/wishlistService.js";
import { WishlistItemAdd, WishlistItemAddType } from "../types/wishlist.js";

async function getWishlistByUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userId } = req.params;
		const wishlist = await wishlistService.getWishlistByUser(Number(userId));
		console.log(wishlist);
		return res.status(StatusCodes.OK).send(wishlist.toJSON().items);
	} catch (err) {
		next(err);
	}
}

async function addItemToWishlist(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const wishlistItemInput = WishlistItemAdd.safeParse(req.body);
		if (wishlistItemInput.success) {
			const userId = req.params.userId;
			const createdItem = await wishlistService.addItemToWishlist(
				Number(userId),
				wishlistItemInput.data
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

async function removeItemFromWishlist(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userId, itemId } = req.params;
		console.log("backend deleting item from wishlist with itemid=" + itemId);

		await wishlistService.removeItemFromWishlist(
			Number(userId),
			Number(itemId)
		);
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (err) {
		next(err);
	}
}

export { addItemToWishlist, removeItemFromWishlist, getWishlistByUser };
