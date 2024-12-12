"use server";

import cloudinary from "@/lib/cloudinary";
import { extractPublicIdFromURL } from "@/lib/helpers";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import { nanoid } from "nanoid";

export async function uploadProfileImage(file: File, username?: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const UploadOptions: UploadApiOptions = {
    public_id: `${nanoid()}-${username || "anon"}`,
    public_id_prefix: "p_id/",
    asset_folder: "profile-image/",
    quality: "auto",
    fetch_format: "auto",
    compression: "low",
    transformation: [
      {
        width: 1200,
        height: 1200,
        crop: "limit",
      },
    ],
  };

  try {
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(UploadOptions, (error, result) => {
            if (error) reject(error);
            if (result) resolve(result);
          })
          .end(buffer);
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
}

export async function deleteImageFromCloud(imageUrl: String) {
  const publicId = extractPublicIdFromURL(imageUrl);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Image deletion error:", error);
    return null;
  }
}
