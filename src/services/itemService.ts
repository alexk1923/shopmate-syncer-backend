import { StatusCodes } from "http-status-codes";
import Item from "../models/itemModel.js";
import { CustomError } from "../errors/errorTypes.js";
import Inventory from "../models/inventoryModel.js";
import { ItemAddType, ItemUpdateType } from "../types/item.js";
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";

const itemService = {
	async getItem(id: number) {
		const item = Item.findByPk(id);
		if (!item) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		return item;
	},

	async getAllItems(inventoryId: number, storeId: number) {
		const items = await Inventory.findAll({ where: { inventoryId } });
		if (storeId) {
			const filteredItems = items.map(
				(item) => item.getDataValue("storeId") === storeId
			);
			return filteredItems;
		}

		return items;
	},

	async addItem(itemData: ItemAddType) {
		const existingItem = await Item.findOne({
			where: { barcode: itemData.barcode },
		});
		if (existingItem) {
			throw new CustomError(
				"Barcode already exists. Update the item if necessary.",
				StatusCodes.CONFLICT
			);
		}

		const existingStore = await Store.findByPk(itemData.storeId);
		if (!existingStore) {
			throw new CustomError("Store not found", StatusCodes.CONFLICT);
		}

		const existingUser = await User.findByPk(itemData.boughtById);
		if (!existingUser) {
			throw new CustomError(
				"Invalid user added as buyer",
				StatusCodes.NOT_FOUND
			);
		}

		const newItem = await Item.create(itemData);
		return newItem;
	},

	async updateItem(id: number, itemUpdate: ItemUpdateType) {
		const existingItem = await Item.findByPk(id);
		if (!existingItem) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		const existingBarcode = await Item.findOne({
			where: { barcode: itemUpdate.barcode },
		});
		if (!existingBarcode) {
			throw new CustomError(
				"An item having this barcode already exists",
				StatusCodes.CONFLICT
			);
		}

		const existingStore = await Store.findByPk(itemUpdate.storeId);
		if (!existingStore) {
			throw new CustomError("Store not found", StatusCodes.CONFLICT);
		}

		const existingUser = await User.findByPk(itemUpdate.boughtById);
		if (!existingUser) {
			throw new CustomError(
				"Invalid user added as buyer",
				StatusCodes.NOT_FOUND
			);
		}

		await existingItem.update(itemUpdate);
		const updatedItem = await Item.findByPk(id);
		return updatedItem;
	},

	async deleteItem(id: number) {
		const item = await Item.findByPk(id);
		if (!item) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		await item.destroy();
	},
};

export default itemService;
