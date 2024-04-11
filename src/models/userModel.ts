import { Model, Table, Column, DataType, BelongsTo, ForeignKey, Unique } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import House from "./houseModel.js";

@Table({
  tableName: "user_table",
})
export default class User extends GenericModel {

  @Unique
  @Column({
    type: DataType.STRING(255),
    field: "email",
  })
  
  email!: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    field: "username"
  })
  
  username!: string;


  @Column({type: DataType.STRING(255)})
  password!: string;
  

  @Column({
    type: DataType.STRING(255),
    field: "first_name"
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(255),
    field: "last_name"
  })
  lastName!: string;

  @Column({
    type: DataType.DATE,
    field: "birthday"
  })
  birthday!: Date;

  @ForeignKey(() => House)
  houseId?: Number | null;

  @BelongsTo(() => House)
  house: House = {} as House;



}


