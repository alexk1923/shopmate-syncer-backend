import express from "express";
import { RecommendationSystem } from "../services/recommendationService.js";
import { getRecommendation } from "../controllers/recommendationController.js";
const router = express.Router();

router.get("/recommendations/:houseId/users/:userId", getRecommendation);

export default router;
