import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	addItem,
	getItem,
	getAllItems,
	updateItem,
	deleteItem,
} from "../controllers/itemController.js";

router.get("/item/:id", getItem);
router.get("/items", getAllItems);
router.post("/item", addItem);
router.patch("/item/:id", updateItem);
router.delete("/item/:id", deleteItem);

export default router;
