import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Table,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import Item from "./itemModel.js";
import House from "./houseModel.js";

@Table({
	tableName: "inventory",
})
export default class Inventory extends GenericModel {
	@HasMany(() => Item)
	items: Item[] = [];

	@BelongsTo(() => House)
	house!: House;

	@ForeignKey(() => House)
	houseId!: number;
}
