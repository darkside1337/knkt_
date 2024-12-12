import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { getUserById } from "@/actions/userActions";

const ProfilePage = async () => {
  const session = await auth();

  const isAuhenticated = session?.user ? true : false;

  if (!isAuhenticated) {
    redirect("/auth/login");
  }

  const userData = await getUserById(session?.user.id as string);

  if (!userData) {
    redirect("/");
  }
  return <div>{JSON.stringify(userData)}</div>;
};

export default ProfilePage;
