import {
	Model,
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey,
	HasOne,
	Unique,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import Store from "./storeModel.js";
import Barcode from "./barCodeModel.js";
import Inventory from "./inventoryModel.js";
import House from "./houseModel.js";

@Table({
	tableName: "item",
})
export default class Item extends GenericModel {
	@Column({
		type: DataType.STRING(255),
		field: "name",
	})
	name?: string;

	@Column({
		type: DataType.INTEGER,
		field: "quantity",
	})
	quantity?: Number;

	@ForeignKey(() => House)
	houseId!: number;
	@BelongsTo(() => House)
	house: House = {} as House;

	@ForeignKey(() => Store)
	storeId!: number;
	@BelongsTo(() => Store)
	store: Store = {} as Store;

	@Unique
	@Column({
		type: DataType.STRING(255),
		field: "barcode",
	})
	barcode?: String;

	@ForeignKey(() => User)
	boughtById!: number;

	@BelongsTo(() => User)
	boughtBy: User = {} as User;
}
