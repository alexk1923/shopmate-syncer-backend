import { Model, Table, Column, DataType, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import Store from "./storeModel.js";
import Barcode from "./barCodeModel.js";

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

  @BelongsTo(() => Store)
  store: Store = {} as Store

  @Column({
    type: DataType.STRING(255),
    field: "bar_code"
  })
  barCode?: String;

  


  @BelongsTo(() => User, {
    foreignKey: 'boughtBy',
    as: 'boughtBy'
  })
  boughtBy: User = {} as User;

  @HasOne(() => Barcode)
  barcode: Barcode = {} as Barcode;

}