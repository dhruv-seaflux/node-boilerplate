import { TRequest, TResponse } from "@/types";
import { NextFunction } from "express";
import { ZodSchema } from "zod";

export const bodyValidator = <T>(schema: ZodSchema<T>) => {
  return (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.formErrors.fieldErrors;
      const simplifiedErrors: { [key: string]: any } = {};
      for (const key in errors) {
        simplifiedErrors[key] = (errors as any)[key][0];
      }
      return res.status(400).json({ errors: simplifiedErrors });
    }

    req.dto = result.data;
    next();
  };
};
