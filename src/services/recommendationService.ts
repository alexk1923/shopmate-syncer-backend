import { differenceInDays, startOfToday } from "date-fns";
import itemService from "./itemService.js";
import Item from "../models/itemModel.js";
import houseService from "./houseService.js";
import e from "express";
import House from "../models/houseModel.js";
import userService from "./userService.js";
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";

const MIN_SIMILARITY = 0.15;

const normalizeString = (str: string) => {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const normalizedEqualStrings = (str1: string, str2: string) => {
	return (
		normalizeString(str1.toLowerCase()) === normalizeString(str2.toLowerCase())
	);
};

function cosineSimilarity(
	vectorA: { [key: string]: number },
	vectorB: { [key: string]: number }
) {
	let dotProduct = 0.0;
	let normA = 0.0;
	let normB = 0.0;
	for (let term in vectorA) {
		dotProduct += vectorA[term] * (vectorB[term] || 0);
		normA += Math.pow(vectorA[term], 2);
	}
	for (let term in vectorB) {
		normB += Math.pow(vectorB[term], 2);
	}
	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const calculateTf = (term: string, document: Item[]) => {
	let tf = 0;
	// console.log(document);

	document.forEach((doc) => {
		console.log("termenul full este: " + doc.name);
		const formattedDocNameList = doc.name?.split(" ");
		// const formattedDocNameList = doc.barcode;

		console.log(formattedDocNameList);
		console.log("=========");
		if (formattedDocNameList) {
			let frequency = formattedDocNameList.filter((docTerm) =>
				normalizedEqualStrings(docTerm, term)
			).length;

			frequency *= doc.quantity;
			tf += frequency;
		}
	});

	// console.info(tf);
	return tf;
};

const calculateTfBarcode = (term: string, document: Item[]) => {
	let tf = 0;
	// console.log(document);
	document.forEach((documentData) => {
		let frequency = document.filter((doc) =>
			normalizedEqualStrings(doc.barcode, term)
		).length;
		frequency *= documentData.quantity;
		tf += frequency;
	});

	return tf;
};

const calculateIdfBarcode = (term: string, documents: Item[][]) => {
	const numberOfDocs = documents.length;

	// Get number of documents that the term appears in
	const termAppearances = documents.reduce(
		(acc: number, currentDoc: Item[]) => {
			const newAcc =
				currentDoc.filter((docItem) =>
					normalizedEqualStrings(docItem.barcode, term)
				).length > 0
					? acc + 1
					: acc;
			return newAcc;
		},
		0
	);

	return 1;

	return Math.log2((numberOfDocs + 1) / (termAppearances + 1));
};

const calculateIdf = (term: string, documents: Item[][]) => {
	const numberOfDocs = documents.length;

	// Get number of documents that the term appears in
	const termAppearances = documents.reduce(
		(acc: number, currentDoc: Item[]) => {
			const newAcc =
				currentDoc.filter((docItem) =>
					normalizedEqualStrings(docItem.name, term)
				).length > 0
					? acc + 1
					: acc;
			return newAcc;
		},
		0
	);

	return Math.log(numberOfDocs / (termAppearances + 1));
};

async function getSimilarItems(
	userId: number,
	documents: Map<number, VectorType>,
	page: number,
	pageSize: number
) {
	// Calculate the vector for the given house
	const user: User = await userService.getUser(userId);
	if (!user.houseId) {
		return [];
	}

	// Get the house data the user is living in
	const house: House = (await houseService.getHouse(user.houseId)).toJSON();
	// Get the user vector (purchases)
	const userVector = documents.get(userId);

	// Calculate the cosine similarity between the house vector and all other house vectors
	let topUsers = [];
	for (const [otherUserId, otherVector] of documents.entries()) {
		if (userVector && otherUserId !== userId) {
			const similarity = cosineSimilarity(userVector, otherVector);
			if (similarity > MIN_SIMILARITY) {
				topUsers.push({
					userId: otherUserId,
					similarity,
					vector: otherVector,
				});
			}
		}
	}

	// Sort by similarity
	topUsers.sort((a, b) => b.similarity - a.similarity);

	let finalItems: {
		name: string;
		image: string;
		barcode: string;
		store: Store;
	}[] = [];
	for (let topUser of topUsers) {
		// Transform key-value to json object
		let items = [];
		for (let barcode in topUser.vector) {
			items.push({ barcode, quantity: topUser.vector[barcode] });
		}

		console.log("the items:");
		console.log(items);
		// Get only non-owned (bought by user) products in user house and sort it by quantity
		finalItems = await Promise.all(
			items
				.filter(
					(a) =>
						!house.items.find(
							(item) => item.boughtById === userId && item.barcode === a.barcode
						)
				)
				.sort((a, b) => b.quantity - a.quantity)
				.slice((page - 1) * pageSize, page * pageSize)
				.map(async (item) => {
					const newItem = (
						await itemService.getItemByBarcodeAndBuyer(
							item.barcode,
							topUser.userId
						)
					)?.toJSON();

					return {
						id: newItem?.id,
						name: newItem?.name,
						barcode: newItem?.barcode,
						image: newItem?.image,
						store: newItem?.store,
					};
				})
		);
	}

	console.log("finalItems:");
	console.log(finalItems);
	return finalItems;
}

type VectorType = { [key: string]: number };
type RecommendationType = {
	collaborativeFiltering: any[];
	soonExpiryItems: any[];
};

export const RecommendationSystem = {
	async getRecommendation(userId: number, page: number, pageSize: number) {
		const allRecommendations: RecommendationType = {
			collaborativeFiltering: [],
			soonExpiryItems: [],
		};

		const user: User = await userService.getUser(userId);
		if (!user.houseId) {
			console.log("here");
			return [];
		}

		const itemsByHouse = (
			await itemService.getAllItemsByHouse({ houseId: user.houseId })
		)
			.map((item) => item.toJSON())
			.filter((item) => item.isFood && item.food);

		allRecommendations.collaborativeFiltering =
			await this.getCollaborativeFiltering(userId, page, pageSize);

		const soonExpiryItems = [];

		// Get items based on expiry dates
		for (let item of itemsByHouse) {
			const daysUntilExpiry = differenceInDays(
				// @ts-ignore
				item.food?.expiryDate,
				startOfToday()
			);
			if (item.boughtBy.id === userId && daysUntilExpiry <= 5) {
				soonExpiryItems.push({
					item,
					message: `Item ${item.name} is expiring in less than five days. Maybe you should buy a new one`,
					daysUntilExpiry,
				});
			}
		}

		soonExpiryItems
			.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
			.slice(0, 5);

		allRecommendations.soonExpiryItems = soonExpiryItems;

		console.log(allRecommendations);
		return allRecommendations;
	},

	async getCollaborativeFiltering(
		userId: number,
		page: number,
		pageSize: number
	) {
		const user: User = await userService.getUser(userId);
		if (!user.houseId) {
			return [];
		}

		const groupedBarcodes = new Map<
			number,
			{ barcode: string; quantity: number }[]
		>();

		// Get food item type
		const allItems: Item[] = (
			await itemService.getAllItems({ page: null, pageSize: null })
		).map((item) => item.toJSON());

		// Populate grouped items (full details)
		allItems.forEach((item) => {
			const buyerId = item.boughtBy.id;
			const group = groupedBarcodes.get(buyerId);
			if (!group) {
				groupedBarcodes.set(buyerId, [
					{ barcode: item.barcode, quantity: item.quantity },
				]);
			} else {
				const existingBarcodeObject = group.find(
					(x) => x.barcode === item.barcode
				);
				if (existingBarcodeObject) {
					existingBarcodeObject.quantity += item.quantity;
				} else {
					group.push({ barcode: item.barcode, quantity: item.quantity });
				}
			}
		});

		const documents = new Map<number, VectorType>();

		for (const [buyerId, listOfBarcodeObjects] of groupedBarcodes.entries()) {
			const userVector: VectorType = {};
			for (const objData of listOfBarcodeObjects) {
				userVector[objData.barcode] = objData.quantity;
			}

			documents.set(buyerId, userVector);
		}

		console.log("Documents:");
		console.log(documents);

		const result = await getSimilarItems(userId, documents, page, pageSize);
		return result;
	},
};
