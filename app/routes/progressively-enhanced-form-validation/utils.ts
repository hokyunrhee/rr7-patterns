import type { FieldError, FieldErrors, FieldValues } from "react-hook-form";

import { z } from "zod";

export function parseZodError<TFieldValues extends FieldValues>(
  zodErrors: z.ZodIssue[],
) {
  const errors: Record<string, FieldError> = {};

  while (zodErrors.length) {
    const error = zodErrors[0];
    const { code, message, path } = error;
    const _path = path.join(".");

    if (!errors[_path]) {
      if ("unionErrors" in error) {
        const unionError = error.unionErrors[0].errors[0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        };
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if ("unionErrors" in error) {
      error.unionErrors.forEach((unionError) =>
        unionError.errors.forEach((e) => zodErrors.push(e)),
      );
    }

    zodErrors.shift();
  }

  return errors as FieldErrors<TFieldValues>;
}
