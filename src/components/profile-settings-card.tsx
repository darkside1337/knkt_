"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { editProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GENDER_ENUM, RELATIONSHIP_STATUS_ENUM } from "@/lib/constants";
import { formatEnumValue, objectHasBeenModified } from "@/lib/helpers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { editProfileData } from "@/actions/userActions";
import { DefaultValues } from "@/types";
import ProfilePictureDragAndDrop from "./profile-picture-drag-and-drop";
import { toast } from "@/hooks/use-toast";
import FlexibleAlert from "./flexible-alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AlertDestructive } from "./ui/error-alert";
import { ErrorsAlert } from "./ui/ErrorsAlert";

const ProfileSettingsCard = ({
  defaultValues,
}: {
  defaultValues: DefaultValues;
}) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[] | undefined>([]);
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  //
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues.profileImage) {
      setImageDataUrl(defaultValues.profileImage);
    }
  }, [defaultValues.profileImage]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    setErrors(undefined);

    // Check if there were changes to the default values
    const hasChanges = objectHasBeenModified(values, defaultValues);

    if (!hasChanges) {
      toast({
        title: "No changes detected",
        description: "Please make changes to your profile",
        variant: "destructive",
      });
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append the data to the form

    Object.keys(values).forEach((key) => {
      // when we are at the profile image field and it's an array we append the first element
      if (
        key === "profileImage" &&
        Array.isArray(values.profileImage) &&
        values.profileImage.length > 0
      ) {
        formData.append("profileImage", values.profileImage[0]);
      } else {
        const valueToAppend =
          values[key as keyof typeof values] === undefined
            ? ""
            : values[key as keyof typeof values];

        formData.append(key, valueToAppend as string | Blob);
      }
    });

    try {
      const response = await editProfileData(formData);

      if (!response.success) {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setErrors([response.message]);
        }
      } else {
        toast({
          title: "Profile updated",
          description: response.message,
          variant: "success",
        });
      }
    } catch (error) {
      setErrors(["Oops, something went wrong. Please try again later."]);
    }
  }

  return (
    <Card className="w-[350px] md:w-[400px] lg:w-[475px] mx-auto my-16">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {imageDataUrl && (
          <Image
            src={imageDataUrl}
            priority={defaultValues.profileImage ? true : false}
            alt="Preview"
            width={200}
            height={200}
            className="rounded-full aspect-square mx-auto border-2 border-dark dark:border-white/80"
          />
        )}
        <Form {...form}>
          {errors && errors.length > 0 && (
            <ErrorsAlert errors={errors} title="Error" className="my-8" />
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ProfilePictureDragAndDrop
              name="profileImage"
              control={form.control}
              onFileSelect={setImageDataUrl}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe7546" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public user name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none min-h-[88px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your bio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*****" type="password" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Your current password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*****" type="password" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Your New Password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Confirm your new password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          {GENDER_ENUM.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {formatEnumValue(gender)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="sr-only">
                    Your gender
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Relationship</SelectLabel>
                          {RELATIONSHIP_STATUS_ENUM.map(
                            (relationshipStatus) => (
                              <SelectItem
                                key={relationshipStatus}
                                value={relationshipStatus}
                              >
                                {formatEnumValue(relationshipStatus)}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="sr-only">
                    Your Relationship Status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettingsCard;
