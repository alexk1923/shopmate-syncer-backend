import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import { addItem, getItem, updateItem, deleteItem } from "../controllers/itemController.js";

router.get("/item/", auth, addItem);
router.get("/item/:userId", auth, getItem);
router.put("/item/:userId", auth, updateItem);
router.delete("/item/:userId", auth, deleteItem);


export default router;