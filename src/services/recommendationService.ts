import { differenceInDays, startOfToday } from "date-fns";
import itemService from "./itemService.js";
import Item from "../models/itemModel.js";
import houseService from "./houseService.js";
import e from "express";
import House from "../models/houseModel.js";
import userService from "./userService.js";
import User from "../models/userModel.js";

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

async function recommendItems(
	userId: number,
	documents: Map<number, VectorType>
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
	let similarities = [];
	for (const [otherUserId, otherVector] of documents.entries()) {
		if (userVector && otherUserId !== userId) {
			const similarity = cosineSimilarity(userVector, otherVector);
			if (similarity > 0.25) {
				similarities.push({
					userId: otherUserId,
					similarity,
					vector: otherVector,
				});
			}
		}
	}

	// Sort by similarity
	similarities.sort((a, b) => b.similarity - a.similarity);

	// Get the top 5 most similar users in terms of purchases
	const topUsers = similarities.slice(0, 5);

	console.log(topUsers);

	const recommendedItems: string[] = [];
	for (let topUser of topUsers) {
		// Transform key-value to json object
		const items = [];
		for (let barcode in topUser.vector) {
			items.push({ barcode, quantity: topUser.vector[barcode] });
		}

		// Get only non-owned (bought by user) products in user house and sort it by quantity
		items
			.filter(
				(a) =>
					!house.items.find(
						(item) => item.boughtById === userId && item.barcode === a.barcode
					)
			)
			.sort((a, b) => b.quantity - a.quantity)
			.slice(0, 5)
			.forEach((item) => recommendedItems.push(item.barcode));
	}

	return recommendedItems;
}

type VectorType = { [key: string]: number };

export const RecommendationSystem = {
	async getRecommendation(userId: number, houseId: number) {
		const allRecommendations = {};

		const itemsByHouse = (await itemService.getAllItemsByHouse({ houseId }))
			.map((item) => item.toJSON())
			.filter((item) => item.isFood && item.food);

		// const allItemsGroupe
		// for (let house of houses) {

		// 	const itemsByHouse = (
		// 		await itemService.getAllItemsByHouse({ houseId: house.id })
		// 	).filter((item) => item.isFood && item.food);

		// }

		// Get grouped terms (only normalized names of items)
		const groupedTerms = new Map<number, string[]>();

		const groupedBarcodes = new Map<
			number,
			{ barcode: string; quantity: number }[]
		>();

		// Get grouped items with full details
		const groupedItems = new Map<number, Item[]>();

		// Get food item type
		const allItems: Item[] = (await itemService.getAllItems())
			.map((item) => item.toJSON())
			.filter((item) => item.isFood && item.food);

		// Populate groupedTerms
		allItems.forEach((item) => {
			const termsList = item.name?.split(" ");
			const houseId = item.houseId;
			for (let term of termsList) {
				const normalizedTerm = normalizeString(term.toLowerCase());
				const group = groupedTerms.get(houseId);
				if (!group) {
					groupedTerms.set(houseId, [normalizedTerm]);
				} else {
					group.push(normalizedTerm);
				}
			}
		});

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

		allItems.forEach((item) => {
			const buyerId = item.boughtBy.id;

			const group = groupedItems.get(buyerId);
			if (!group) {
				groupedItems.set(buyerId, [item]);
			} else {
				group.push(item);
			}
		});

		// Get list of arrays after grouping
		const allItemsGroupedArray = Array.from(groupedItems.values());
		const documents = new Map<number, VectorType>();

		/* For each house, get the list of terms and determine tfIdf score for each one, then add it
		 * to the respective house (=document) map
		 */
		// for (const [houseId, listOfTerms] of groupedTerms.entries()) {
		// 	const houseVector: VectorType = {};
		// 	for (const term of listOfTerms) {
		// 		console.log("Pentru termenul " + term + " din casa cu id= " + houseId);

		// 		console.log("Trimit mai departe urmatorul grouped items:");

		// 		const grouped = groupedItems.get(houseId);
		// 		const groupedMap = grouped?.map((group) => {
		// 			return { id: group.id, name: group.name, quantity: group.quantity };
		// 		});
		// 		console.log(groupedMap);

		// 		const tf = calculateTf(term, groupedItems.get(houseId) ?? []);
		// 		const idf = calculateIdf(term, allItemsGroupedArray);
		// 		const tfIdf = tf * idf;
		// 		houseVector[term] = tfIdf;
		// 	}

		// 	documents.set(houseId, houseVector);
		// }

		for (const [buyerId, listOfBarcodeObjects] of groupedBarcodes.entries()) {
			const userVector: VectorType = {};
			for (const objData of listOfBarcodeObjects) {
				userVector[objData.barcode] = objData.quantity;
			}

			documents.set(buyerId, userVector);
		}

		console.log("Documents:");
		console.log(documents);

		allRecommendations.collaborateFiltering = await recommendItems(
			userId,
			documents
		);
		console.log(allRecommendations);

		// for (const term of differentTerms) {
		// 	const tf = calculateTf(term, itemsByHouse);
		// 	const idf = calculateIdf(term, allItemsGroupedArray);
		// 	objTfIdf.push({ term, tfIdf: tf * idf });
		// }

		// console.log(objTfIdf);

		// calculateTf("sare", itemsByHouse);
		// calculateTf("sare", allItems);

		// const soonExpiryItems = [];

		// // Get items based on expiry dates
		// for (let item of filteredItems) {
		// 	const daysUntilExpiry = differenceInDays(
		// 		// @ts-ignore
		// 		item.food?.expiryDate,
		// 		startOfToday()
		// 	);
		// 	if (item.boughtById === userId && daysUntilExpiry <= 5) {
		// 		soonExpiryItems.push({
		// 			item,
		// 			message: `Item ${item.name} is expiring in less than five days. Maybe you should buy a new one`,
		// 			daysUntilExpiry,
		// 		});
		// 	}
		// }

		// soonExpiryItems.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

		// const recommendations = await getRecommendations(user, items);
	},
};
