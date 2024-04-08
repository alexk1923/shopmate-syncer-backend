import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import { createHouse, getHouse, deleteHouse, updateHouse, addUserToHouse } from "../controllers/houseController.js";

router.get("/house/", auth, createHouse);
router.get("/house/:houseId", auth, getHouse);
router.post("/house/:houseId/members", auth, addUserToHouse);
router.put("/house/:houseId", auth, updateHouse);
router.delete("/house/:houseId", auth, deleteHouse);


export default router;