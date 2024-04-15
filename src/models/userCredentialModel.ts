import { Table, Unique, Column, DataType, ForeignKey,BelongsTo} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";

@Table({
    tableName: "user_credential",
  })
  export default class UserCredential extends GenericModel {
  
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

    @ForeignKey(() => User)
    userId!: number;

    @BelongsTo(() => User)
    user : User = {} as User;
  
  }