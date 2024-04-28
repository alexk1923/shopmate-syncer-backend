import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	addStore,
	getStore,
	updateStore,
	deleteStore,
	getAllStores,
} from "../controllers/storeController.js";

router.post("/store", auth, addStore);
router.get("/store", auth, getAllStores);
router.get("/store/:id", auth, getStore);
router.patch("/store/:id", auth, updateStore);
router.delete("/store/:id", auth, deleteStore);

export default router;
