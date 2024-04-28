import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
	createHouse,
	getHouse,
	deleteHouse,
	updateHouse,
	addUserToHouse,
	removeUserFromHouse,
} from "../controllers/houseController.js";
import { Paths } from "swagger-jsdoc";

// Routes
router.post("/house/", auth, createHouse);
router.get("/house/:id", auth, getHouse);
router.post("/house/:id/members", auth, addUserToHouse);
router.delete("/house/:id/members/:memberId", auth, removeUserFromHouse);
router.patch("/house/:id", auth, updateHouse);
router.delete("/house/:id", auth, deleteHouse);

// Schema
export const HouseSchema = {
	type: "object",
	properties: {
		id: {
			type: "number",
			description: "The unique identifier of the house",
		},
		name: {
			type: "string",
			description: "The name of the house",
		},
		members: {
			type: "array",
			items: {
				type: "string",
			},
		},
		createdAt: {
			type: "string",
			format: "date",
			description: "The date when the house was created",
		},
	},
	required: ["id", "name", "dateCreate"],
};

// API
export const houseApi: Paths = {
	"/api/house/": {
		post: {
			tags: ["House"],
			summary: "Create house",
			security: [
				{
					bearerAuth: [],
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: {
									type: "string",
								},
								defaultMembers: {
									type: "array",
									items: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "House created",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/HouseSchema",
							},
						},
					},
				},
				400: {
					description: "Bad request, invalid body",
				},
				404: {
					description: "User having provided username not found",
				},
				409: {
					description: "User is already in another house",
				},
				500: {
					description: "Server error creating the house",
				},
			},
		},
	},
	"/api/house/{id}": {
		get: {
			tags: ["House"],
			summary: "Get house",
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: {
						type: "number",
					},
				},
			],
			responses: {
				200: {
					description: "House details",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/HouseSchema",
							},
						},
					},
				},
				404: {
					description: "House not found",
				},
				500: {
					description: "Server error in getting house",
				},
			},
		},
		patch: {
			tags: ["House"],
			summary: "Update house",
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: {
						type: "string",
					},
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: {
									type: "string",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "House updated",
					type: "object",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									id: {
										type: "number",
									},
									name: {
										type: "string",
									},
									createdAt: {
										type: "string",
										format: "date",
									},
									updatedAt: {
										type: "string",
										format: "date",
									},
								},
							},
						},
					},
				},
				404: {
					description: "House not found",
				},
				500: {
					description: "Server error in updating house",
				},
			},
		},
		delete: {
			tags: ["House"],
			summary: "Delete house",
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: {
						type: "string",
					},
				},
			],
			responses: {
				204: {
					description: "House deleted",
				},
				404: {
					description: "House not found. Wrong id or maybe already deleted",
				},
				500: {
					description: "Server error in deleting house",
				},
			},
		},
	},
	"/api/house/{id}/members": {
		post: {
			tags: ["House"],
			summary: "Add user to house",
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: {
						type: "number",
					},
				},
			],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								userId: {
									type: "number",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "User added to house",
				},
				404: {
					description: "House / user not found",
				},
				500: {
					description: "Server error in adding user to house",
				},
			},
		},
	},
	"/api/house/{id}/members/{memberId}": {
		delete: {
			tags: ["House"],
			summary: "Remove member from house",
			security: [
				{
					bearerAuth: [],
				},
			],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: {
						type: "number",
					},
				},
				{
					name: "memberId",
					in: "path",
					required: true,
					schema: {
						type: "number",
					},
				},
			],
			responses: {
				204: {
					description: "House deleted",
				},
				404: {
					description:
						"House / member not found. Wrong id or maybe already deleted",
				},
				500: {
					description: "Server error in deleting house",
				},
			},
		},
	},
};
export default router;
