import { Model, Table, Column, DataType, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import Store from "./storeModel.js";
import Barcode from "./barCodeModel.js";
import Inventory from "./inventoryModel.js";

@Table({
  tableName: "item",
})
export default class Item extends GenericModel {

  @Column({
    type: DataType.STRING(255),
    field: "name"
  })
  name?: string;

  @Column({
    type: DataType.INTEGER,
    field: "quantity"
  })
  quantity?: Number;

  @Column({
    type: DataType.STRING(255),
    field: "store"
  })
  storeName?: String;

  @ForeignKey(() => Store)
  storeId!: number;
  @BelongsTo(() => Store)
  store: Store = {} as Store


  @ForeignKey(() => Inventory)
  inventoryId!: number;
  @BelongsTo(() => Inventory)
  inventory: Inventory = {} as Inventory


  @Column({
    type: DataType.STRING(255),
    field: "bar_code"
  })
  barCode?: String;

  @ForeignKey(() => User)
  boughtById!: number;

  @BelongsTo(() => User)
  boughtBy: User = {} as User;

  @HasOne(() => Barcode)
  barcode: Barcode = {} as Barcode;

}