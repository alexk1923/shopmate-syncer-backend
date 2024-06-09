import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	updateShoppingList,
	deleteShoppingList,
	addShoppingSchedule,
	getShoppingScheduleList,
} from "../controllers/shoppingScheduleController.js";

router.post("/shopping-schedule", addShoppingSchedule);
router.get("/shopping-schedule", getShoppingScheduleList);
router.patch("/shopping-schedule/:id", updateShoppingList);
router.delete("/shopping-schedule/:id", deleteShoppingList);

export default router;
