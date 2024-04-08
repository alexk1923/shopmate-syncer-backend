import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";

router.get("/user/:userId", auth, getUser);
router.get("/user/:userId", auth, createUser);
router.put("/user/:userId", auth, updateUser);
router.delete("/user/:userId", auth, deleteUser);


export default router;