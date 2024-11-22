import { Table, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import GenericModel from "./genericModel.js";
import User from "./userModel.js";
import WishlistItem from "./wishlistItemModel.js";

@Table({
	tableName: "wishlist",
})
export default class Wishlist extends GenericModel {
	@HasMany(() => WishlistItem)
	items: WishlistItem[] = [];

	@ForeignKey(() => User)
	userId!: number;

	@BelongsTo(() => User)
	user: User = {} as User;
}
