import { z } from "zod";

type Paths = {
	[path: string]: {
		[method: string]: {
			tags?: string[];
			summary?: string;
			parameters?: {
				name: string;
				in: string;
				required?: boolean;
				schema: {
					type: string;
				};
			}[];
			responses: {
				[response: string]: {
					description: string;
				};
			};
		};
	};
};

/* === VALIDATION === */

/* ==== USER === */
const UserUpdate = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	birthday: z.coerce.date().optional(),
	profilePicture: z.string().optional(),
});
type UserUpdateType = z.infer<typeof UserUpdate>;

const UserCreation = z.object({
	username: z.string(),
	email: z.string().email(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	birthday: z.coerce.date().optional(),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

type UserCreationType = z.infer<typeof UserCreation>;

/* === HOUSE === */
const HouseCreation = z.object({
	name: z.string(),
	defaultMembers: z.array(z.string()).nonempty(),
	image: z.string().nullable(),
});

const HouseUpdate = z.object({
	name: z.string(),
});

const HouseAddMember = z.object({
	userId: z.number(),
});

const NotificationTokenUpdate = z.object({
	notificationToken: z.string(),
});

export {
	UserCreation,
	UserCreationType,
	UserUpdate,
	UserUpdateType,
	HouseCreation,
	HouseUpdate,
	HouseAddMember,
	Paths,
	NotificationTokenUpdate,
};
