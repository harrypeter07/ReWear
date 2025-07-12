import { z } from "zod";

// ✅ USER SCHEMA
export const userSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).default("user"),
  points: z.number().default(100),
  isBanned: z.boolean().default(false),
  joinedAt: z.date().optional()
});

// ✅ ITEM SCHEMA
export const itemSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
  size: z.string(),
  condition: z.string(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).nonempty(), // base64 strings allowed
  uploaderId: z.string().length(24),
});


// ✅ SWAP REQUEST SCHEMA
export const swapSchema = z.object({
  itemId: z.string().length(24),
  requesterId: z.string().length(24),
  type: z.enum(["swap", "redeem"]),
  status: z.enum(["pending", "accepted", "rejected", "cancelled"]).default("pending"),
  createdAt: z.date().optional(),
  resolvedAt: z.date().optional()
});
