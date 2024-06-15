import {
	Model,
	Table,
	Column,
	DataType,
	CreatedAt,
	UpdatedAt,
} from "sequelize-typescript";

export default class GenericModel extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		field: "id",
	})
	id!: number;

	@CreatedAt
	readonly createdAt?: Date;

	@UpdatedAt
	readonly updatedAt?: Date;
}
