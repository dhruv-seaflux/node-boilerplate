import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Exporting inferred type for TypeScript usage
export type User = z.infer<typeof UserSchema>;

// User Zod Schema
export const UserSchema = z.object({
  id: z.number().openapi({
    description: "Unique identifier for the user",
    example: 1,
  }),
  name: z.string().openapi({
    description: "Name of the user",
    example: "John Doe",
  }),
  email: z.string().email().openapi({
    description: "Email address of the user",
    example: "john.doe@example.com",
  }),
  password: z.string().openapi({
    description: "Hashed password of the user",
    example: "$2b$10$EwJh...",
  }),
  createdAt: z.date().openapi({
    description: "Timestamp when the user was created",
    example: "2024-01-01T00:00:00Z",
  }),
  updatedAt: z.date().openapi({
    description: "Timestamp when the user was last updated",
    example: "2024-01-02T00:00:00Z",
  }),
});

// Schema for 'GET users/:id' endpoint validation
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Schema for User Sign-In
export const UserSignInSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Invalid email address" }) // Adds a custom error message
      .min(5, { message: "Email must be at least 5 characters long" }) // Ensures the email field has a reasonable minimum length
      .openapi({
        description: "User's email address",
        example: "john.doe@example.com",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }) // Custom error message for the minimum length
      .max(64, { message: "Password cannot exceed 64 characters" }) // Adds an upper limit for security
      .regex(/[A-Za-z]/, { message: "Password must contain letters" }) // Ensures the password has at least one letter
      .regex(/\d/, { message: "Password must contain at least one number" }) // Ensures the password has at least one number
      .openapi({
        description: "User's password (8-64 characters, includes at least one letter and one number)",
        example: "admin@123",
      }),
  })
  .strict(); // Ensures no extra fields are passed

export const UserSignInResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    token: z.string(),
  }),
});

// https://github.com/asteasolutions/zod-to-openapi
