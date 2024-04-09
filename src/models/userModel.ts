import { Model, Table, Column, DataType, BelongsTo } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import House from "./houseModel.js";

@Table({
  tableName: "user_table",
})
export default class User extends GenericModel {

  @Column({
    type: DataType.STRING(255),
    field: "title"
  })
  username?: string;

  @Column({
    type: DataType.STRING(255),
    field: "first_name"
  })
  firstName?: string;

  @Column({
    type: DataType.STRING(255),
    field: "last_name"
  })
  lastName?: string;

  @Column({
    type: DataType.DATE,
    field: "birthday"
  })
  birthday?: Date;

  @BelongsTo(() => House)
  house: House = {} as House;

}