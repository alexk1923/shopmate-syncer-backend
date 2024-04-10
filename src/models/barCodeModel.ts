import {  Table, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import Item from "./itemModel.js";

@Table({
  tableName: "barcode",
})
export default class Barcode extends GenericModel {

  @Column({
    type: DataType.STRING(255),
    field: "barcodeStr"
  })
  barcodeStr?: string;

  @ForeignKey(() => Item)
  itemId!: Number;

  @BelongsTo(() => Item)
  item: Item = {} as Item;

}