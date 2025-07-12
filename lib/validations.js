// Example using Zod
import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export const itemSchema = z.object({
	title: z.string().min(2),
	description: z.string().min(10),
	category: z.string(),
	image: z.string().url().optional(),
});
