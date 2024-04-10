import { Column, DataType, HasMany } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import Item from "./itemModel.js";

export default class Inventory extends GenericModel {
    @Column({
        type: DataType.STRING(255),
        field: "name"
    })
    name!: string;

    @HasMany(() => Item)
    items: Item[] = [];

}