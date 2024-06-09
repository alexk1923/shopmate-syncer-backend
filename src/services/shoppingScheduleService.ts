import { StatusCodes } from "http-status-codes";
import ShoppingSchedule from "../models/shoppingScheduleModel.js";
import Store from "../models/storeModel.js";
import {
	ShoppingFilterType,
	ShoppingScheduleAddType,
} from "../types/shoppingSchedule.js";
import { CustomError } from "../errors/errorTypes.js";
import User from "../models/userModel.js";

const shoppingScheduleService = {
	async addShoppingSchedule(shoppingListAdd: ShoppingScheduleAddType) {
		const existingUser = await User.findByPk(shoppingListAdd.createdById);
		if (!existingUser) {
			throw new CustomError("Invalid user as creator", StatusCodes.NOT_FOUND);
		}

		const shoppingSchedule = await ShoppingSchedule.create(shoppingListAdd);
		return shoppingSchedule;
	},
	async getShoppingScheduleList(shoppingListGet: ShoppingFilterType) {
		const shoppingScheduleList = await ShoppingSchedule.findAll({
			where: { houseId: shoppingListGet.houseId },
			include: {
				model: User,
				attributes: ["id", "username", "firstName", "lastName"],
			},
		});
		return shoppingScheduleList;
	},

	async removeShoppingSchedule(id: number) {
		const shoppingSchedule = await ShoppingSchedule.findByPk(id);
		if (!shoppingSchedule) {
			throw new CustomError("Shopping event not found", StatusCodes.NOT_FOUND);
		}

		await shoppingSchedule.destroy();
		return;
	},
};

export default shoppingScheduleService;
