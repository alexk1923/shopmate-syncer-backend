import { Sequelize } from "sequelize";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { CustomError } from "../errors/errorTypes.js";
import { StatusCodes } from "http-status-codes";
import UserCredential from "../models/userCredentialModel.js";
import {
	UserCreation,
	UserCreationType,
	UserUpdate,
	UserUpdateType,
} from "../types/index.js";
import wishlistService from "./wishlistService.js";

const userService = {
	async getUsers() {
		const users = await User.findAll();
		return users;
	},

	async createUser(userRegisterData: UserCreationType) {
		// Find if there is a user with the same username or email
		const { username, email, firstName, lastName, birthday, password } =
			userRegisterData;
		const existingUser = await User.findOne({
			where: Sequelize.or({ username }, { email }),
		});

		if (existingUser) {
			if (existingUser.getDataValue("username") === userRegisterData.username) {
				throw new CustomError(
					"There is already an account using the same username",
					StatusCodes.CONFLICT
				);
			} else if (
				existingUser.getDataValue("email") === userRegisterData.email
			) {
				throw new CustomError(
					"There is already an account using the same email address",
					StatusCodes.CONFLICT
				);
			} else {
				throw new CustomError(
					"Duplicate data for unique field",
					StatusCodes.CONFLICT
				);
			}
		}

		const saltRounds = 10;
		const encryptedPass = await bcrypt.hash(password, saltRounds);

		// Store user and password in db
		const newUser = new User({
			email,
			username,
			firstName,
			lastName,
			birthday,
		});
		await newUser.save();

		await wishlistService.createWishlistForUser(newUser.id);

		const newCredentials = new UserCredential({
			email,
			username,
			password: encryptedPass,
			userId: newUser.getDataValue("id"),
		});
		await newCredentials.save();

		return newUser;
	},

	async getUser(id: number) {
		const user = await User.findByPk(id);
		if (!user) {
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}
		return user;
	},

	async updateUser(userUpdate: UserUpdateType, id: number) {
		const { firstName, lastName, birthday, profilePicture } = userUpdate;
		const updatedUserId = await User.update(
			{ firstName, lastName, birthday, profilePicture },
			{ where: { id } }
		);

		// No rows affected
		if (updatedUserId[0] === 0) {
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}

		const newUser = await User.findByPk(id);
		return newUser;
	},

	async deleteUser(id: number) {
		await User.destroy({ where: { id } });
		return;
	},
};

export default userService;
