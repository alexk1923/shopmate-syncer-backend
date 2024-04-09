import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";

router.get("/user/:userId", getUser);
router.get("/user/:userId",createUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);


export default router;