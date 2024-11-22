import User from "./models/userModel.js";
import Wishlist from "./models/wishlistModel.js";
import wishlistService from "./services/wishlistService.js";
import connectToDatabase from "./db/dbConfig.js";

export const addWishlistsDefault = async () => {
	try {
		// Get all users
		const users = await User.findAll({});

		for (const user of users) {
			// Check if the user already has a wishlist
			const existingWishlist = await Wishlist.findOne({
				where: { userId: user.id },
			});

			// If the user does not have a wishlist, create one
			if (!existingWishlist) {
				await wishlistService.createWishlistForUser(user.id);
			}
		}

		console.log("Wishlists created for all users without one.");
	} catch (error) {
		console.error("Error creating wishlists for existing users:", error);
	}
};
