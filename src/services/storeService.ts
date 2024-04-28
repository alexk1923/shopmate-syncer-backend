import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/errorTypes.js";
import Store from "../models/storeModel.js";
import { StoreAddType, StoreUpdateType } from "../types/store.js";

const storeService = {
	async addStore(storeAdd: StoreAddType) {
		const store = await Store.create(storeAdd);
		return store;
	},

	async getAllStores() {
		return await Store.findAll();
	},

	async getStore(id: number) {
		const store = await Store.findByPk(id);
		if (!store) {
			throw new CustomError("Store not found", StatusCodes.NOT_FOUND);
		}
		return store;
	},

	async updateStore(id: number, storeUpdate: StoreUpdateType) {
		const store = await Store.findByPk(id);
		if (!store) {
			throw new CustomError("Store not found", StatusCodes.NOT_FOUND);
		}
		await store.update(storeUpdate);
		const updatedStore = await store.save();
		return updatedStore;
	},

	async deleteStore(id: number) {
		const store = await Store.findByPk(id);
		if (!store) {
			throw new CustomError("Store not found", StatusCodes.NOT_FOUND);
		}

		await store.destroy();
		return;
	},
};

export default storeService;
