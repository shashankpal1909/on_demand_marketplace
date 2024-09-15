import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ErrorPayload } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(payload: ErrorPayload) {
  const { detail } = payload;

  if (typeof detail === "string") {
    return detail;
  } else if (
    Array.isArray(detail) &&
    detail.every((item) => typeof item === "object")
  ) {
    return detail
      .map((err) => `Invalid ${err.loc[err.loc.length - 1]}`)
      .join("\n");
  } else {
    return "An unexpected error occurred.";
  }
}
