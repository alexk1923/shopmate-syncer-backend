import { Column, DataType, HasMany } from "sequelize-typescript";
import Item from "./itemModel.js";
import FoodType from "./foodTagModel.js";

export default class Food extends Item {
    @Column({
        type: DataType.DATE,
        field: "expiry_date"
      })
      expiryDate?: Date;

    @Column({
        type: DataType.STRING(255),
        field: "food_type"
    })

    @HasMany(() => FoodType)
    foodType: FoodType[] = [];
}