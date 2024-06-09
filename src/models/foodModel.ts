import {
	BelongsTo,
	BelongsToMany,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	Unique,
} from "sequelize-typescript";
import Item from "./itemModel.js";
import GenericModel from "./genericModel.js";
import Food_FoodCategory from "./food-foodCategory.js";
import FoodCategory from "./foodCategory.js";

@Table({
	tableName: "food",
})
export default class Food extends GenericModel {
	@ForeignKey(() => Item)
	@Column(DataType.INTEGER)
	itemId!: number;

	@BelongsTo(() => Item)
	item!: Item;

	@Column(DataType.DATE)
	expiryDate!: Date;

	@BelongsToMany(() => FoodCategory, () => Food_FoodCategory)
	tags!: FoodCategory[];
}
