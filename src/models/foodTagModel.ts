import { BelongsTo, Column, DataType } from "sequelize-typescript";
import Item from "./itemModel.js";
import GenericModel from "./genericModel.js";
import Food from "./foodModel.js";

export default class FoodType extends GenericModel{
    @Column({
        type: DataType.STRING,
        field: "type"
      })
      type!: string;

      @BelongsTo(() => Food)
      foodItem: Food = {} as Food;
}