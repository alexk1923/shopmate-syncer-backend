import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	createShoppingList,
	updateShoppingList,
	deleteShoppingList,
	getShoppingList,
} from "../controllers/shoppingListController.js";

router.post("/shoppingList", createShoppingList);
router.get("/shoppingList/:id", getShoppingList);
router.patch("/shoppingList/:id", updateShoppingList);
router.delete("/shoppingList/:id", deleteShoppingList);

export default router;
