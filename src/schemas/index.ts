import {
  ACCEPTED_IMAGE_TYPES,
  GENDER_ENUM,
  MAX_DIMENSIONS,
  MAX_PROFILE_PICTURE_SIZE_IN_KB,
  MIN_DIMENSIONS,
  RELATIONSHIP_STATUS_ENUM,
} from "@/lib/constants";
import { createOptionalStringField, formatBytes } from "@/lib/helpers";
import { z } from "zod";

import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_BIO_LENGTH,
  MAX_BIO_LENGTH,
} from "@/lib/constants";
import { create } from "domain";

// schema for bypassing client side validation and tesing server side
export const BypassSchemas = z.any();

// registration has username, email, password, confirm password
export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(35, { message: "Username must be less than 35 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const verificationLinkSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const emailOnlySchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// the schema for the password reset link

export const passwordsSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmNewPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

const profilePictureImageSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Please upload a valid image file (JPEG, PNG, or WebP)",
  })
  .refine((file) => file.size <= MAX_PROFILE_PICTURE_SIZE_IN_KB, {
    message: `Profile image must be less than ${formatBytes(
      MAX_PROFILE_PICTURE_SIZE_IN_KB
    )}`,
  });

const passwordSchema = z
  .union([
    z.string().min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
    z.string().length(0),
  ])
  .optional();

export const editProfileSchema = z
  .object({
    profileImage: z
      .union([
        z.array(profilePictureImageSchema).min(1),
        profilePictureImageSchema,
        z.string().nullable(),
      ])
      .optional(),
    displayName: createOptionalStringField(2, 100, "Display Name"),
    username: createOptionalStringField(
      MIN_USERNAME_LENGTH,
      MAX_USERNAME_LENGTH,
      "Username"
    ),
    relationshipStatus: z
      .enum(RELATIONSHIP_STATUS_ENUM, {
        message: "Invalid relationship status",
      })
      .optional(),
    bio: createOptionalStringField(MIN_BIO_LENGTH, MAX_BIO_LENGTH, "Bio"),
    gender: z.enum(GENDER_ENUM, { message: "Invalid gender" }).optional(),
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .superRefine(({ confirmNewPassword, newPassword, currentPassword }, ctx) => {
    // Only validate passwords if either new password field is filled
    if (newPassword || confirmNewPassword) {
      if (!newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password is required when confirming password",
          path: ["newPassword"],
        });
      }
      if (!confirmNewPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password confirmation is required",
          path: ["confirmNewPassword"],
        });
      }
      if (confirmNewPassword !== newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmNewPassword"],
        });
      }
      if (!currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your current password",
          path: ["currentPassword"],
        });
      }
    }
  });
