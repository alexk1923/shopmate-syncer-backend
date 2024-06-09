import {
	Table,
	ForeignKey,
	Column,
	DataType,
	BelongsTo,
	Model,
} from "sequelize-typescript";
import Food from "./foodModel.js";
import GenericModel from "./genericModel.js";
import FoodCategory from "./foodCategory.js";

@Table({
	tableName: "food_food_category",
})
export default class Food_FoodCategory extends Model {
	@ForeignKey(() => Food)
	@Column(DataType.INTEGER)
	foodId!: number;

	@BelongsTo(() => Food)
	food!: Food;

	@ForeignKey(() => FoodCategory)
	@Column(DataType.INTEGER)
	foodCategoryId!: number;

	@BelongsTo(() => FoodCategory)
	foodCategory!: FoodCategory;
}
