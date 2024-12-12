import ProfileSettingsCard from "@/components/profile-settings-card";
import { auth } from "../../../../auth";
import { getUserById } from "@/actions/userActions";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

const ProfileSettingsPage = async () => {
  const session = await auth();
  const isAuthenticated = session?.user ? true : false;
  if (!isAuthenticated) {
    redirect("/auth/login");
  }
  const user = await getUserById(session?.user.id as string);
  console.log("User:", user);

  const defaultValues = {
    profileImage: user?.image || "",
    username: user?.username || "",
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    gender: user?.gender || ("NOT_MENTIONED" as const),
    relationshipStatus: user?.relationshipStatus || ("NOT_MENTIONED" as const),
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  return <ProfileSettingsCard defaultValues={defaultValues} />;
};

export default ProfileSettingsPage;
