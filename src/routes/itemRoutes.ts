import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	addItem,
	getItem,
	getAllItems,
	updateItem,
	getAllFood,
	deleteItem,
} from "../controllers/itemController.js";

router.get("/items/:id", getItem);
router.get("/items", getAllItems);
router.get("/food", getAllFood);
router.post("/items", addItem);
router.patch("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

export default router;
