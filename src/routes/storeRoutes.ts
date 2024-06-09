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

router.post("/stores", auth, addStore);
router.get("/stores", auth, getAllStores);
router.get("/stores/:id", auth, getStore);
router.patch("/stores/:id", auth, updateStore);
router.delete("/stores/:id", auth, deleteStore);

export default router;
