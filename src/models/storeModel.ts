import {
	Model,
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";

@Table({
	tableName: "store",
})
export default class Store extends GenericModel {
	@Column({
		type: DataType.STRING(255),
		field: "name",
	})
	name?: string;

	@Column({
		type: DataType.STRING(512),
		field: "address",
	})
	address?: string;

	@Column({
		type: DataType.STRING(255),
		field: "image",
	})
	image?: string;
}
