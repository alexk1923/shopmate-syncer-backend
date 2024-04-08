import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import {createShoppingList , updateShoppingList, deleteShoppingList, getShoppingList } from "../controllers/shoppingListController.js";

router.post("/shoppingList", auth, createShoppingList);
router.get("/shoppingList/:shoppingListId", auth, getShoppingList);
router.put("/shoppingList/:shoppingListId", auth, updateShoppingList);
router.delete("/shoppingList/:shoppingListId", auth, deleteShoppingList);


export default router;