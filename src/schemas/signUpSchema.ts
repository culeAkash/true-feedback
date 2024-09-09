import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "Username can't be less than 5 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9\s]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
