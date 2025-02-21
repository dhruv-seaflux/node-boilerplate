import { ServiceResponseSchema } from "@/common/models/serviceResponse";
import { UserSignInResponseSchema, UserSignInSchema } from "@/db/schemas";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const userRegistry = new OpenAPIRegistry();

// Use the ServiceResponseSchema with the UserSignInResponseSchema
const UserSignInResponseServiceSchema = ServiceResponseSchema(UserSignInResponseSchema);

userRegistry.registerPath({
  method: "post",
  path: "/users/sign-in",
  tags: ["User"],
  request: {
    body: {
      description: "User sign in",
      content: {
        "application/json": {
          schema: UserSignInSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User sign-in successful",
      content: {
        "application/json": {
          schema: UserSignInResponseServiceSchema, // Use the schema with defaults
        },
      },
    },
  },
});
