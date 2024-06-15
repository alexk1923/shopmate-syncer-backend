import { Expo } from "expo-server-sdk";
import schedule from "node-schedule";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import { differenceInDays, startOfDay, startOfToday } from "date-fns";
import UserCredential from "../models/userCredentialModel.js";
import { CustomError } from "../errors/errorTypes.js";
import { StatusCodes } from "http-status-codes";
import itemService from "./itemService.js";

const sentNotifications = async function () {
	const users = await User.findAll();

	const expo = new Expo();
	// Create the messages
	let messages = [];
	for (let user of users) {
		const userCredential = await UserCredential.findOne({
			where: {
				id: user.id,
			},
		});
		if (user.houseId) {
			const items = await itemService.getAllItemsByHouse({
				houseId: user.houseId,
			});
			for (let item of items) {
				let body;
				// console.log("item is:");
				// console.log(item.food);
				if (item.food) {
					const expiryDays = differenceInDays(
						item.food.expiryDate,
						startOfToday()
					);
					console.log("difference is" + expiryDays);
					if (expiryDays < 0) {
						console.log("Already expired");
						body = `Your item, ${item.name} has expired ${
							expiryDays * -1
						} days ago. Be aware if it is still safe to consume this product`;
					} else if (expiryDays === 0) {
						body = `Today your item ${item.name} is expiring`;
					} else if (expiryDays <= 3) {
						body = `Your item ${item.name} will expire in less than 3 days`;
					} else if (expiryDays < 7) {
						body = `Your item ${item.name} will expire this week`;
					}
				}

				if (
					userCredential?.notificationToken &&
					Expo.isExpoPushToken(userCredential.notificationToken)
				) {
					messages.push({
						to: userCredential.notificationToken,
						sound: "default",
						body: body,
						data: { item: item },
						volume: 15,
					});
				}
			}
		}
	}

	// Send the notifications
	// @ts-ignore
	let chunks = expo.chunkPushNotifications(messages);
	console.log("==================================================");

	console.log("my chunks:");
	console.log(chunks);
	console.log("==================================================");

	for (let chunk of chunks) {
		try {
			let receipts = await expo.sendPushNotificationsAsync(chunk);
			console.log(receipts);
		} catch (error) {
			console.error(error);
		}
	}
};

export const NotificationService = {
	initializeNotificationScheduler: () => {
		console.info("Initialising scheduler...");
		// sentNotifications();
		schedule.scheduleJob("0 8 * * *", sentNotifications);
	},

	updateNotificationToken: async (
		userId: number,
		notificationToken: string
	) => {
		const user = await UserCredential.findByPk(userId);
		if (!user) {
			throw new CustomError("User not found", StatusCodes.NOT_FOUND);
		}

		await user.update({ notificationToken });
		const newUser = await user.save();
		return newUser;
	},
};
