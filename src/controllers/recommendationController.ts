import { NextFunction, Request, Response, query } from "express";
import Item from "../models/itemModel.js";
import itemService from "../services/itemService.js";
import { StatusCodes } from "http-status-codes";
import {
	ItemAdd,
	ItemUpdate,
	ItemsFilter,
	ItemsFilterType,
} from "../types/item.js";
import { CustomError } from "../errors/errorTypes.js";
import { RecommendationSystem } from "../services/recommendationService.js";

async function getRecommendation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userId, houseId } = req.params;
		const item = await RecommendationSystem.getRecommendation(
			Number(userId),
			Number(houseId)
		);
		return res.status(StatusCodes.OK).send(item);
	} catch (err) {
		next(err);
	}
}

async function getSimilarUsersRecommendation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userId } = req.params;
		const page = Number(req.query.page) ?? null;
		const pageSize = Number(req.query.pageSize) ?? null;

		const recommendedItems =
			await RecommendationSystem.getCollaborativeFiltering(
				Number(userId),
				page,
				pageSize
			);
		return res.status(StatusCodes.OK).send(recommendedItems);
	} catch (err) {
		next(err);
	}
}

export { getRecommendation, getSimilarUsersRecommendation };
