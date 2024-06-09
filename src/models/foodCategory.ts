import {
	AutoIncrement,
	BelongsToMany,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import Food from "./foodModel.js";
import Food_FoodCategory from "./food-foodCategory.js";
import GenericModel from "./genericModel.js";

@Table({
	tableName: "food_category",
})
export default class FoodCategory extends GenericModel {
	@Column(DataType.STRING)
	name!: string;

	@BelongsToMany(() => Food, () => Food_FoodCategory)
	foods!: Food[];
}
