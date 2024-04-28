import { z } from "zod";

const ItemsFilter = z.object({
	houseId: z.number(),
	storeId: z.number().optional(),
});

const ItemAdd = z.object({
	name: z.string(),
	quantity: z.number(),
	houseId: z.number(),
	storeId: z.number(),
	boughtById: z.number(),
	barcode: z.string(),
});

const ItemUpdate = z.object({
	name: z.string().optional(),
	quantity: z.number().nonnegative().optional(),
	storeId: z.number().optional(),
	boughtById: z.number().optional(),
	barcode: z.string().optional(),
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
