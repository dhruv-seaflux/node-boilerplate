import { z } from "zod";

export const SignUpUserDTO = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type TSignUpUserDTO = z.infer<typeof SignUpUserDTO>;
