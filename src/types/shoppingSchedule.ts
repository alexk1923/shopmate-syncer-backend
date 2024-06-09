import { z } from "zod";

const ShoppingScheduleAdd = z.object({
	title: z.string(),
	shoppingDate: z.coerce.date(),
	houseId: z.number(),
	createdById: z.number(),
});

const ShoppingFilter = z.object({
	houseId: z.number(),
});

type ShoppingScheduleAddType = z.infer<typeof ShoppingScheduleAdd>;
type ShoppingFilterType = z.infer<typeof ShoppingFilter>;

export {
	ShoppingScheduleAdd,
	ShoppingFilter,
	ShoppingScheduleAddType,
	ShoppingFilterType,
};
