import { Column, DataType, HasMany, Table } from "sequelize-typescript";
import Item from "./itemModel.js";
import FoodType from "./foodTagModel.js";

@Table({
    tableName: "food",
  })
export default class Food extends Item {
    @Column({
        type: DataType.DATE,
        field: "expiry_date"
      })
      expiryDate?: Date;

    @HasMany(() => FoodType)
    foodType: FoodType[] = [];
}