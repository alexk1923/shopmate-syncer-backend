import { z } from "zod";

const WishlistItemAdd = z.object({
	originalId: z.number().nullable(),
	name: z.string(),
	description: z.string(),
	image: z.string().url({ message: "Invalid image url" }).optional().nullable(),
});

type WishlistItemAddType = z.infer<typeof WishlistItemAdd>;

export { WishlistItemAddType, WishlistItemAdd };
