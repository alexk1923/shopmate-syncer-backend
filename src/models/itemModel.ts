import {
	Model,
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey,
	HasOne,
	Unique,
	Default,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import Store from "./storeModel.js";

import House from "./houseModel.js";
import Food from "./foodModel.js";

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
	quantity?: number;

	@Column({
		type: DataType.STRING,
		field: "image",
	})
	image?: string;

	@Default(false)
	@Column({
		type: DataType.BOOLEAN,
		field: "is_food",
	})
	isFood?: boolean;

	@ForeignKey(() => House)
	houseId!: number;
	@BelongsTo(() => House)
	house: House = {} as House;

	@ForeignKey(() => Store)
	storeId!: number;
	@BelongsTo(() => Store)
	store: Store = {} as Store;

	@Column({
		type: DataType.STRING(255),
		field: "barcode",
	})
	barcode?: string;

	@ForeignKey(() => User)
	boughtById!: number;

	@BelongsTo(() => User)
	boughtBy: User = {} as User;

	@HasOne(() => Food)
	food?: Food;
}
