import { Sequelize } from "sequelize-typescript";
import Store from "../models/storeModel.js";
import Food from "../models/foodModel.js";
import User from "../models/userModel.js";
import House from "../models/houseModel.js";
import Item from "../models/itemModel.js";
import UserCredential from "../models/userCredentialModel.js";
import FoodCategory from "../models/foodCategory.js";
import Food_FoodCategory from "../models/food-foodCategory.js";
import { foodCategories } from "../constants/constants.js";
import ShoppingSchedule from "../models/shoppingScheduleModel.js";
import Wishlist from "../models/wishlistModel.js";
import WishlistItem from "../models/wishlistItemModel.js";

async function initializeDb() {
	for (const name of foodCategories) {
		const [foodCategory, created] = await FoodCategory.findOrCreate({
			where: { name },
			defaults: { name },
		});

		if (created) {
			console.log(`Created new food category: ${foodCategory.name}`);
		} else {
			console.log(`Found existing food category: ${foodCategory.name}`);
		}
	}
}

async function connectToDatabase() {
	const sequelize = new Sequelize({
		dialect: "postgres",
		host: process.env.POSTGRES_HOST,
		database: process.env.POSTGRES_DB,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		port: Number(process.env.POSTGRES_PORT),
		models: [
			Store,
			User,
			House,
			Item,
			Food,
			FoodCategory,
			Food_FoodCategory,
			UserCredential,
			ShoppingSchedule,
			Wishlist,
			WishlistItem,
		],
	});

	sequelize
		.authenticate()
		.then(() => {
			console.log("Connection has been established successfully.");
			initializeDb();
			sequelize.sync({ alter: true });
		})
		.catch((error) => {
			console.error("Unable to connect to the database:");
			console.log(error);
		});
}

export default connectToDatabase;
