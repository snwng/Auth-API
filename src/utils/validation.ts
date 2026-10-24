import * as z from "zod";

const userSchema = z.object({
	id: z.number().int().nonnegative(),
	email: z.email(),
	firstName: z.string().nonempty(),
	lastName: z.string().nonempty(),
	password: z.string().nonempty(),
	refreshToken: z.string().nullable(),
	createdAt: z.string().nonempty(),
});

const signUpSchema = z.object({
	email: z.email(),
	firstName: z.string().nonempty(),
	lastName: z.string().nonempty(),
	password: z.string().nonempty(),
});

const logInSchema = z.object({
	email: z.email(),
	password: z.string().nonempty(),
});

const tokenPayloadSchema = z.object({
	id: z.number().int().nonnegative(),
	email: z.email(),
});

const jwtSchema = z.jwt();

export { userSchema, signUpSchema, logInSchema, tokenPayloadSchema, jwtSchema };
