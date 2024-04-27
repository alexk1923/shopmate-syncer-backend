import { z } from "zod";

const ItemsFilter = z.object({
	inventoryId: z.number(),
	storyId: z.number().optional(),
});

const ItemAdd = z.object({
	name: z.string(),
	quantity: z.number(),
	inventoryId: z.number(),
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

export { ItemsFilter, ItemAdd, ItemUpdate, ItemAddType, ItemUpdateType };
