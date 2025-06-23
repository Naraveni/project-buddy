import { ZodError } from "zod";

export type FormattedZodErrors = Record<string, string[]>;

export function formatZodErrors(error: ZodError): FormattedZodErrors {
  const formatted: FormattedZodErrors = {};

  for (const issue of error.errors) {
    const field = issue.path[0]?.toString() || "form";
    if (!formatted[field]) formatted[field] = [];
    formatted[field].push(issue.message);
  }

  return formatted;
}
