import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	getWishlistByUser,
	addItemToWishlist,
	removeItemFromWishlist,
} from "../controllers/wishlistController.js";

router.get("/wishlists/:userId", auth, getWishlistByUser);
router.post("/wishlists/:userId", auth, addItemToWishlist);
router.delete("/wishlists/:userId/items/:itemId", auth, removeItemFromWishlist);

export default router;
