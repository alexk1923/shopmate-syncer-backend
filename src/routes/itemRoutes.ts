import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	addItem,
	getItem,
	getItemsByHouse,
	updateItem,
	getAllFood,
	deleteItem,
	getAllItems,
} from "../controllers/itemController.js";

router.get("/items/:id", getItem);
router.get("/items", getAllItems);
router.get("/items/house/:houseId", getItemsByHouse);
router.get("/food", getAllFood);
router.post("/items", addItem);
router.patch("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

export default router;
