import express from 'express';
const router = express.Router();
import { auth } from "../middleware/auth.js"
import { createHouse, getHouse, deleteHouse, updateHouse, addUserToHouse } from "../controllers/houseController.js";

router.get("/house/", createHouse);
router.get("/house/:houseId",  getHouse);
router.post("/house/:houseId/members", addUserToHouse);
router.put("/house/:houseId", updateHouse);
router.delete("/house/:houseId", deleteHouse);


export default router;