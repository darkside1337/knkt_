import { redirect } from "next/navigation";
import { auth } from "../../auth";
import Feed from "@/components/feed";
import Tabs from "@/components/desktop-tabs";
import { TabsType } from "@/types";

export default async function Home({
  searchParams,
}: {
  searchParams: { tab?: TabsType };
}) {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  if (!isAuthenticated) {
    redirect("/auth/login");
  }
  const activeTab = searchParams.tab || TabsType.FOR_YOU;
  return (
    <>
      <Tabs activeTab={activeTab} />
      <Feed />
    </>
  );
}
