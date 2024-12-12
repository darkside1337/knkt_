"use server";
import bcrypt from "bcryptjs";

import prisma from "@/lib/db";
import { editProfileSchema } from "@/schemas";
import { auth } from "../../auth";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";
import {
  deleteImageFromCloud,
  uploadProfileImage,
} from "@/actions/uploadActions";
import { User } from "@prisma/client";
import { prettifyZodErrors } from "@/lib/helpers";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const usernameAlreadyInUse = async (
  username: string
): Promise<boolean> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
export const editProfileData = async (formData: FormData) => {
  console.log("Form data:", Object.fromEntries(formData));
  try {
    const session = await auth();
    if (!session?.user.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const validatedData = editProfileSchema.safeParse({
      profileImage: formData.get("profileImage"),
      username: formData.get("username") || undefined,
      displayName: formData.get("displayName") || undefined,
      bio: formData.get("bio"),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
      gender: formData.get("gender"),
      relationshipStatus: formData.get("relationshipStatus"),
    });

    console.log("Validated data:", validatedData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: prettifyZodErrors(validatedData.error),
      };
    }

    const {
      profileImage,
      username,
      displayName,
      bio,
      currentPassword,
      newPassword,
      confirmNewPassword,
      gender,
      relationshipStatus,
    } = validatedData.data;

    // data to update
    const updateData: Partial<User> = {};
    // errors to return
    const errors: string[] = [];
    const user = await getUserById(session.user.id);

    console.log("User:", user);

    // Handle profile image upload
    if (profileImage instanceof File && profileImage.size > 0) {
      // if user already has an image, delete the old one

      if (user?.image) {
        const deleted = await deleteImageFromCloud(user.image);
        console.log("Deleted image:", deleted);
      }

      // upload current one
      const uploadedImageUrl = await uploadProfileImage(profileImage, username);
      if (uploadedImageUrl) {
        updateData.image = uploadedImageUrl;
      } else {
        errors.push("Image upload failed");
      }
    }

    // handle username update

    if (username && username !== user?.username) {
      const isUsernameAlreadyInUse = await usernameAlreadyInUse(username);

      console.log("Username already in use:", isUsernameAlreadyInUse);

      if (isUsernameAlreadyInUse) {
        errors.push("Username already in use");
      } else {
        updateData.username = username;
      }
    }

    // handle display name update
    if (displayName && displayName !== user?.displayName) {
      updateData.displayName = displayName;
    }

    // handle password logic
    if (currentPassword && newPassword && confirmNewPassword) {
      const passwordsMatch = await bcrypt.compare(
        currentPassword,
        user?.password as string
      );

      console.log("Passwords match:", passwordsMatch);

      if (!passwordsMatch) {
        errors.push("Current password is incorrect");
      } else {
        updateData.password = await bcrypt.hash(
          newPassword,
          BCRYPT_SALT_ROUNDS
        );
      }
    }

    // handle bio, gender and relationship status
    if (bio) updateData.bio = bio;
    if (gender) updateData.gender = gender;
    if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;

    if (errors.length > 0) {
      return {
        success: false,
        message: "Invalid form data",
        errors,
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    console.log("Updated user:", updatedUser);

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Edit profile error:", error);
    return {
      success: false,
      message: "An error occurred while updating your profile",
    };
  }
};
