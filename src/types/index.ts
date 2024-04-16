import {z} from 'zod'


export const UserUpdate = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthday: z.coerce.date().optional(),
})
export type UserUpdateType = z.infer<typeof UserUpdate>;

export const UserCreation = z.object({
    username: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    birthday: z.coerce.date().optional(),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
  });

export type UserCreationType = z.infer<typeof UserCreation>;