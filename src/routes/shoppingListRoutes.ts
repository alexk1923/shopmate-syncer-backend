import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import {createShoppingList , updateShoppingList, deleteShoppingList, getShoppingList } from "../controllers/shoppingListController.js";

router.post("/shoppingList", createShoppingList);
router.get("/shoppingList/:shoppingListId",  getShoppingList);
router.put("/shoppingList/:shoppingListId",  updateShoppingList);
router.delete("/shoppingList/:shoppingListId",  deleteShoppingList);


export default router;