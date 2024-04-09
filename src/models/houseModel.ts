import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";

@Table({
  tableName: "house_table",
})
export default class House extends GenericModel {

  @Column({
    type: DataType.STRING(255),
    field: "name"
  })
  name?: string;

  @Column({
    type: DataType.DATE,
    field: "date_created"
  })
  dateCreated?: Date;
  
  @HasMany(() => User)
  members: User[] = [];
}