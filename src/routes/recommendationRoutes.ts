import express from "express";
import { RecommendationSystem } from "../services/recommendationService.js";
import {
	getRecommendation,
	getSimilarUsersRecommendation,
} from "../controllers/recommendationController.js";
const router = express.Router();

router.get("/recommendations/:houseId/users/:userId", getRecommendation);
router.get("/recommendations/users/:userId", getSimilarUsersRecommendation);

export default router;
