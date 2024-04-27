import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	addItem,
	getItem,
	updateItem,
	deleteItem,
} from "../controllers/itemController.js";

router.post("/item", addItem);
router.get("/item/:userId", getItem);
router.put("/item/:userId", updateItem);
router.delete("/item/:userId", deleteItem);

export default router;
