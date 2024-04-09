import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import Store from "./storeModel.js";

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

  @Column({
    type: DataType.STRING(255),
    field: "bar_code"
  })
  barCode?: String;

  @BelongsTo(() => Store)
  store: Store = {} as Store

  @Column({
    type: DataType.DATE,
    field: "expiry_date"
  })
  expiryDate?: Date;

  @ForeignKey(() => User)
  @Column
  boughtBy: {username: String, dateBought: Date} = {} as {username: String, dateBought: Date};

  @BelongsTo(() => User)
  user: User = {} as User;

}