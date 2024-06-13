import {
	Model,
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey,
	Unique,
	HasOne,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import House from "./houseModel.js";
import UserCredential from "./userCredentialModel.js";

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

	@Column({
		type: DataType.STRING(255),
		field: "profilePicture",
	})
	profilePicture?: string;

	@Unique
	@Column({
		type: DataType.STRING(255),
		field: "username",
	})
	username!: string;

	@Column({
		type: DataType.STRING(255),
		field: "first_name",
	})
	firstName!: string;

	@Column({
		type: DataType.STRING(255),
		field: "last_name",
	})
	lastName!: string;

	@Column({
		type: DataType.DATE,
		field: "birthday",
	})
	birthday?: Date | null;

	@ForeignKey(() => House)
	houseId?: number | null;

	@BelongsTo(() => House)
	house: House = {} as House;

	@HasOne(() => UserCredential)
	userCredential: UserCredential = {} as UserCredential;
}
