import { string, z } from "zod";

const StoreAdd = z.object({
	name: z.string(),
	address: z.string(),
	image: z.string().url({ message: "Invalid image url" }).optional(),
});

const StoreUpdate = z.object({
	name: z.string().min(1).optional(),
	address: z.string().min(1).optional(),
	image: z.string().url().optional(),
});

type StoreAddType = z.infer<typeof StoreAdd>;
type StoreUpdateType = z.infer<typeof StoreUpdate>;

export { StoreAdd, StoreUpdate, StoreAddType, StoreUpdateType };
