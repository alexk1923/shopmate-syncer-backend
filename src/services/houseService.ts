import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/errorTypes.js";
import House from "../models/houseModel.js";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";

const houseService = {
	async createHouse(
		houseName: string,
		defaultMembersList: string[],
		image: string | null
	) {
		const userList = [];
		for (let memberUsername of defaultMembersList) {
			const user = await User.findOne({ where: { username: memberUsername } });
			if (!user) {
				throw new CustomError(
					`${memberUsername} has not been found`,
					StatusCodes.NOT_FOUND
				);
			}

			if (user.houseId !== null) {
				throw new CustomError(
					`${memberUsername} is already in another house`,
					StatusCodes.CONFLICT
				);
			}

			userList.push(user);
		}

		const house = new House({ name: houseName, image });
		const createdHouse = await house.save();
		for (let user of userList) {
			await user.update({ houseId: createdHouse.id });
		}

		return createdHouse;
	},

	async getHouse(id: number) {
		const house = await House.findByPk(id, {
			include: [
				User,
				{
					model: Item,
					as: "items",
					attributes: ["id", "barcode", "quantity", "image", "name"],
				},
			],
		});
		if (!house) {
			throw new CustomError("House not found", StatusCodes.NOT_FOUND);
		}
		return house;
	},

	async getAllHouses() {
		const housesList = await House.findAll({});
		return housesList;
	},

	async updateHouse(id: number, name: string) {
		const house = await House.findByPk(id);
		if (!house) {
			throw new CustomError("House not found", StatusCodes.NOT_FOUND);
		}
		await house.update({ name });
		const updatedHouse = await house.save();
		return updatedHouse;
	},

	async deleteHouse(id: number) {
		const house = await House.findByPk(id);
		if (!house) {
			throw new CustomError("House not found", StatusCodes.NOT_FOUND);
		}

		await house.destroy();
		return;
	},

	async addUserToHouse(houseId: number, userId: number) {
		const house = await House.findByPk(houseId, { include: [User] });
		if (!house) {
			throw new CustomError("House not found", StatusCodes.NOT_FOUND);
		}

		const user = await User.findByPk(userId);
		if (!user) {
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}

		if (user.houseId) {
			throw new CustomError("User is already in a house", StatusCodes.CONFLICT);
		}

		await user.update({ houseId });
		const updatedHouse = await House.findByPk(houseId);
		return updatedHouse;
	},

	async removeUserFromHouse(houseId: number, userId: number) {
		const house = await House.findByPk(houseId);
		if (!house) {
			throw new CustomError("House not found", StatusCodes.NOT_FOUND);
		}

		const user = await User.findByPk(userId);
		if (!user) {
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}

		await user.update({ houseId: null });
		const updatedHouse = await House.findByPk(houseId);

		return updatedHouse;
	},
};

export default houseService;
