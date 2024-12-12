import { Control, Controller } from "react-hook-form";
import Dropzone from "react-dropzone";
import { FiDownload } from "react-icons/fi";
import { editProfileSchema } from "@/schemas";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
const ProfilePictureDragAndDrop = ({
  control,
  onFileSelect,
}: {
  control: Control<z.infer<typeof editProfileSchema>>;
  name: "profileImage";
  onFileSelect: (file: string) => void;
}) => {
  return (
    <FormField
      control={control}
      name="profileImage"
      render={({ field: { onChange, onBlur, value } }) => (
        <FormItem>
          <FormLabel>Profile Image</FormLabel>
          <FormControl>
            <Dropzone
              onDrop={(acceptedFiles) => {
                onChange(acceptedFiles);
                if (acceptedFiles.length > 0) {
                  const file = acceptedFiles[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onFileSelect(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              maxFiles={1}
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "image/webp": [".webp"],
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
                >
                  <input {...getInputProps()} onBlur={onBlur} />
                  <FiDownload className="size-12 md:size-14 lg:size-24" />
                  {value &&
                    Array.isArray(value) &&
                    value.map((file) => <div key={file.name}>{file.name}</div>)}
                </div>
              )}
            </Dropzone>
          </FormControl>
          <FormDescription>Profile image</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfilePictureDragAndDrop;
