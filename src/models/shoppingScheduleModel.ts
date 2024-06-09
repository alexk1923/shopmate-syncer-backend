import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Table,
} from "sequelize-typescript";

import GenericModel from "./genericModel.js";

import House from "./houseModel.js";
import User from "./userModel.js";

@Table({
	tableName: "shopping_schedule",
})
export default class ShoppingSchedule extends GenericModel {
	@ForeignKey(() => House)
	@Column(DataType.INTEGER)
	houseId!: number;

	@BelongsTo(() => House)
	house!: House;

	@Column(DataType.STRING)
	title!: string;

	@Column(DataType.DATE)
	shoppingDate!: Date;

	@ForeignKey(() => User)
	createdById!: number;

	@BelongsTo(() => User)
	createdBy: User = {} as User;
}
