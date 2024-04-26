import {
	Model,
	Table,
	Column,
	DataType,
	HasMany,
	BeforeDestroy,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";

export interface IHouse extends House {
	setMembers: (users: User[]) => Promise<void>;
}

@Table({
	tableName: "house",
})
export default class House extends GenericModel {
	@Column({
		type: DataType.STRING(255),
		field: "name",
	})
	name?: string;

	@HasMany(() => User)
	members: User[] = [];

	@BeforeDestroy
	static async nullifyUsersHouse(instance: House) {
		await User.update({ houseId: null }, { where: { houseId: instance.id } });
	}
}
