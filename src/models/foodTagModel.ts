import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import Item from "./itemModel.js";
import GenericModel from "./genericModel.js";
import Food from "./foodModel.js";

@Table({
  tableName: "food_type",
})
export default class FoodType extends GenericModel{
    @Column({
        type: DataType.STRING,
        field: "type"
      })
      type!: string;

      @ForeignKey(() => Food)
      foodId!: number;

      @BelongsTo(() => Food)
      foodItem: Food = {} as Food;
}