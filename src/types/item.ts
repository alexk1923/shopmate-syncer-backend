import { z } from "zod";
import { foodCategories } from "../constants/constants.js";

enum ITEMS_SORTING {
	EXPIRY_DATE = "expiryDate",
}

const ItemsFilter = z.object({
	houseId: z.number(),
	storeId: z.number().optional(),
	sortBy: z.string().optional(),
});

const ItemAdd = z.object({
	name: z.string(),
	quantity: z.number(),
	image: z.string().optional().nullable(),
	houseId: z.number(),
	store: z.object({
		id: z.number().nullable(),
		name: z.string().optional(),
		address: z.string().optional(),
		image: z.string().optional(),
	}),
	boughtById: z.number(),
	barcode: z.string(),
	isFood: z.boolean().optional(),
	expiryDate: z.coerce.date().optional(),
	tags: z.array(z.enum(foodCategories)).optional(),
});

const ItemUpdate = z.object({
	name: z.string().optional(),
	imageUrl: z.string().optional(),
	quantity: z.number().nonnegative().optional(),
	storeId: z.number().optional(),
	boughtById: z.number().optional(),
	barcode: z.string().optional(),
	isFood: z.boolean().optional(),
	expiryDate: z.coerce.date().optional(),
	tags: z.array(z.enum(foodCategories)).optional(),
});

type ItemAddType = z.infer<typeof ItemAdd>;
type ItemUpdateType = z.infer<typeof ItemUpdate>;
type ItemsFilterType = z.infer<typeof ItemsFilter>;

export {
	ItemsFilter,
	ItemAdd,
	ItemUpdate,
	ItemAddType,
	ItemUpdateType,
	ItemsFilterType,
};
