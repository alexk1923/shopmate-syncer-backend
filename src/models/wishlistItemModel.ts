import {
	Model,
	Table,
	Column,
	DataType,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import GenericModel from "./genericModel.js";

import Wishlist from "./wishlistModel.js";

@Table({
	tableName: "wishlist_item",
})
export default class WishlistItem extends GenericModel {
	@Column({
		type: DataType.STRING(255),
		field: "name",
	})
	name!: string;

	@Column({
		type: DataType.INTEGER,
		field: "original_id",
	})
	originalId!: number | null;

	@Column({
		type: DataType.STRING(512),
		field: "description",
	})
	description!: string;

	@Column({
		type: DataType.STRING,
		field: "image",
	})
	image?: string;

	@ForeignKey(() => Wishlist)
	wishlistId!: number;
	@BelongsTo(() => Wishlist)
	wishlist: Wishlist = {} as Wishlist;
}
