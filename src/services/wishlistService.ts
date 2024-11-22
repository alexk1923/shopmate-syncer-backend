import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/errorTypes.js";
import Store from "../models/storeModel.js";
import { StoreAddType, StoreUpdateType } from "../types/store.js";
import Wishlist from "../models/wishlistModel.js";
import WishlistItem from "../models/wishlistItemModel.js";
import { Transaction } from "sequelize";

const wishlistService = {
	// Get the wishlist by user ID
	async getWishlistByUser(userId: number) {
		const wishlist = await Wishlist.findOne({
			where: { userId },
			include: [WishlistItem],
		});

		if (!wishlist) {
			throw new Error("Wishlist not found");
		}

		return wishlist;
	},

	// Add an item to the wishlist
	async addItemToWishlist(
		userId: number,
		itemData: {
			name: string;
			description: string;
			image?: string | null;
			originalId?: number | null;
		}
	) {
		const wishlist = await this.getWishlistByUser(userId);

		if (itemData.originalId) {
			const existingItem = await WishlistItem.findOne({
				where: { originalId: itemData.originalId },
			});
			if (existingItem) {
				throw new CustomError(
					"Item was already added into the wishlist",
					StatusCodes.CONFLICT
				);
			}
		}

		const newItem = await WishlistItem.create({
			...itemData,
			wishlistId: wishlist.id,
		});

		return newItem;
	},

	// Remove an item from the wishlist
	async removeItemFromWishlist(userId: number, itemId: number) {
		const wishlist = await this.getWishlistByUser(userId);

		const item = await WishlistItem.findOne({
			where: { id: itemId, wishlistId: wishlist.id },
		});

		if (!item) {
			throw new Error("Item not found in the wishlist");
		}

		await item.destroy();
		return item;
	},

	// Create an empty wishlist for a new user
	async createWishlistForUser(userId: number, transaction?: Transaction) {
		const wishlist = await Wishlist.create({ userId }, { transaction });
		return wishlist;
	},
};

export default wishlistService;
