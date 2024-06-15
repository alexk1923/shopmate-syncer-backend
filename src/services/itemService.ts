import { StatusCodes } from "http-status-codes";
import Item from "../models/itemModel.js";
import { CustomError } from "../errors/errorTypes.js";
import { ItemAddType, ItemUpdateType, ItemsFilterType } from "../types/item.js";
import Store from "../models/storeModel.js";
import User from "../models/userModel.js";
import House from "../models/houseModel.js";
import Food from "../models/foodModel.js";
import FoodCategory from "../models/foodCategory.js";
import Food_FoodCategory from "../models/food-foodCategory.js";
import storeService from "./storeService.js";

const itemService = {
	async getItem(id: number) {
		const item = Item.findByPk(id);
		if (!item) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		return item;
	},

	async getAllItems() {
		const itemList = await Item.findAll({
			attributes: [
				"id",
				"name",
				"image",
				"quantity",
				"isFood",
				"houseId",
				"barcode",
			],
			include: [
				{
					model: User,
					as: "boughtBy",
					attributes: ["id", "username", "firstName", "lastName"],
				},
				{
					model: Food,
					attributes: ["id", "expiryDate"],
					include: [
						{
							model: FoodCategory,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: [], // We don't need any attributes from the join table
							},
						},
					],
				},
				{
					model: Store,
					attributes: ["id", "name", "address"],
				},
			],
		});

		return itemList;
	},

	async getAllItemsByHouse(itemsFilter: ItemsFilterType) {
		const itemList = await Item.findAll({
			where: { houseId: itemsFilter.houseId },
			attributes: [
				"id",
				"name",
				"image",
				"quantity",
				"isFood",
				"houseId",
				"barcode",
			],
			include: [
				{
					model: User,
					as: "boughtBy",
					attributes: ["id", "username", "firstName", "lastName"],
				},
				{
					model: Food,
					attributes: ["id", "expiryDate"],
					include: [
						{
							model: FoodCategory,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: [], // We don't need any attributes from the join table
							},
						},
					],
				},
				{
					model: Store,
					attributes: ["id", "name", "address"],
				},
			],
		});

		if (itemsFilter.storeId) {
			const filteredItems = itemList.filter(
				(item) => item.getDataValue("storeId") === itemsFilter.storeId
			);
			return filteredItems;
		}

		return itemList;
	},

	async getAllFood(itemsFilter: ItemsFilterType) {
		const foodList = await Item.findAll({
			where: { houseId: itemsFilter.houseId, isFood: true },
			attributes: [
				"name",

				"quantity",
				"isFood",
				"houseId",
				"storeId",
				"barcode",
			],
			include: [
				{
					model: User,
					as: "boughtBy",
					attributes: ["id", "username", "firstName", "lastName"],
				},
				{
					model: Food,
					attributes: ["id", "expiryDate"],
					include: [
						{
							model: FoodCategory,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: [], // We don't need any attributes from the join table
							},
						},
					],
				},
			],
		});

		console.log("my food list:");
		console.log(foodList);

		if (itemsFilter.storeId) {
			const filteredFoodList = foodList.map(
				(item) => item.getDataValue("storeId") === itemsFilter.storeId
			);
			return filteredFoodList;
		}

		return foodList;
	},

	async addItem(itemData: ItemAddType) {
		if (
			itemData.store.id === null &&
			(!itemData.store.name ||
				itemData.store.name?.length === 0 ||
				!itemData.store.address)
		) {
			throw new CustomError(
				"Store name and address must be passed as params when id is null. Store name cannot be empty",
				StatusCodes.BAD_REQUEST
			);
		}

		let storeId = itemData.store.id ?? null;

		if (itemData.store.id) {
			const existingStore = await Store.findByPk(itemData.store.id);
			if (!existingStore) {
				throw new CustomError("Store not found", StatusCodes.NOT_FOUND);
			}
		}

		if (!storeId) {
			const newStore = await storeService.addStore({
				name: itemData.store.name ?? "Unnamed product",
				address: itemData.store.address ?? "",
			});

			if (newStore.id) {
				storeId = newStore.id;
			}
		}

		const existingUser = await User.findByPk(itemData.boughtById);
		if (!existingUser) {
			throw new CustomError(
				"Invalid user added as buyer",
				StatusCodes.NOT_FOUND
			);
		}

		const newItem = await Item.create({ ...itemData, storeId });

		await this.addItemAsFood(itemData, newItem);

		return newItem;
	},

	async addItemAsFood(inputData: ItemUpdateType | ItemAddType, baseItem: Item) {
		if (inputData.isFood) {
			const newFood = await Food.create({
				itemId: baseItem.id,
				expiryDate: inputData.expiryDate,
			});

			// Assign food category to the item
			if (inputData.tags) {
				for (const tagName of inputData.tags) {
					const category = await FoodCategory.findOne({
						where: { name: tagName },
					});

					if (!category) {
						throw new CustomError(
							`Invalid food category: ${tagName}`,
							StatusCodes.BAD_REQUEST
						);
					}

					await Food_FoodCategory.create({
						foodId: newFood.id,
						foodCategoryId: category.id,
					});
				}
			}
		}
	},

	async updateItem(id: number, itemUpdate: ItemUpdateType) {
		const existingItem = await Item.findByPk(id);
		if (!existingItem) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		if (itemUpdate.barcode) {
			const existingBarcode = await Item.findOne({
				where: { barcode: itemUpdate.barcode },
			});
			if (!existingBarcode) {
				throw new CustomError(
					"An item having this barcode already exists",
					StatusCodes.CONFLICT
				);
			}
		}

		if (itemUpdate.storeId) {
			const existingStore = await Store.findByPk(itemUpdate.storeId);
			if (!existingStore) {
				throw new CustomError("Store not found", StatusCodes.CONFLICT);
			}
		}

		if (itemUpdate.boughtById) {
			const existingUser = await User.findByPk(itemUpdate.boughtById);
			if (!existingUser) {
				throw new CustomError(
					"Invalid user added as buyer",
					StatusCodes.NOT_FOUND
				);
			}
		}

		await existingItem.update(itemUpdate);
		const updatedItem = await Item.findByPk(id);

		if (updatedItem) {
			if (existingItem.isFood) {
				await this.updateItemAsFood(itemUpdate, updatedItem);
			} else if (!existingItem.isFood && itemUpdate.isFood) {
				await this.addItemAsFood(
					{
						name: updatedItem.name,
						quantity: updatedItem.quantity,
						houseId: updatedItem.houseId,
						storeId: updatedItem.storeId,
						boughtById: updatedItem.boughtById,
						barcode: updatedItem.barcode,
						isFood: updatedItem.isFood,
						expiryDate: itemUpdate.expiryDate,
						tags: itemUpdate.tags,
					},
					updatedItem
				);
			}
		}

		return updatedItem;
	},

	async updateItemAsFood(itemUpdate: ItemUpdateType, baseItem: Item) {
		const existingFood = await Food.findOne({ where: { itemId: baseItem.id } });

		if (!existingFood) {
			throw new CustomError("Food item not found", StatusCodes.NOT_FOUND);
		}

		if (itemUpdate.expiryDate) {
			existingFood.expiryDate = itemUpdate.expiryDate;
		}

		await existingFood.save();

		// Update food categories
		if (itemUpdate.tags) {
			// Remove existing tags
			await Food_FoodCategory.destroy({ where: { foodId: existingFood.id } });

			// Add new tags
			for (const tagName of itemUpdate.tags) {
				const category = await FoodCategory.findOne({
					where: { name: tagName },
				});

				if (!category) {
					throw new CustomError(
						`Invalid food category: ${tagName}`,
						StatusCodes.BAD_REQUEST
					);
				}

				await Food_FoodCategory.create({
					foodId: existingFood.id,
					foodCategoryId: category.id,
				});
			}
		}
	},

	async deleteItem(id: number) {
		const item = await Item.findByPk(id);
		if (!item) {
			throw new CustomError("Item not found", StatusCodes.NOT_FOUND);
		}

		const food = await Food.findOne({ where: { itemId: id } });
		await food?.destroy();

		await item.destroy();
	},
};

export default itemService;
