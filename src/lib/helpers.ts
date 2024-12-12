import { editProfileSchema } from "@/schemas";
import { z, ZodError } from "zod";

export const formatEnumValue = (s: string) => {
  return s
    .toLowerCase()
    .split("_")
    .map((letter) => `${letter[0].toUpperCase()}${letter.slice(1)}`)
    .join(" ");
};
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const objectHasBeenModified = <T extends Record<string, any>>(
  values: T,
  defaultValues: T
): boolean => {
  return Object.keys(values).some((key) => values[key] !== defaultValues[key]);
};

// Helper for creating optional string fields with empty string handling
export const createOptionalStringField = (
  minLength: number,
  maxLength: number,
  fieldName: string
) =>
  z
    .union([
      z
        .string()
        .min(minLength, {
          message: `${fieldName} must be at least ${minLength} characters`,
        })
        .max(maxLength, {
          message: `${fieldName} must be less than ${maxLength} characters`,
        }),
      z.string().length(0),
    ])
    .optional();
export const extractPublicIdFromURL = (url: String) => {
  const publicId = `p_id/${url.split("/p_id/").pop()}`;
  return publicId;
};

export const prettifyZodErrors = (error: ZodError): string[] => {
  // Flatten the error and extract fieldErrors
  const fieldErrors = error.flatten().fieldErrors;
  const errors: string[] = [];

  // Loop through the error object
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key]?.forEach((item) => {
      if (item) {
        errors.push(item);
      }
    });
  });

  return errors;
};
