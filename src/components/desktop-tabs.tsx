"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { TabsType } from "@/types";

const DESKTOP_TABS = [
  {
    id: TabsType.FOR_YOU,
    label: "For you",
    href: `/?tab=${TabsType.FOR_YOU}`,
  },
  {
    id: TabsType.FOLLOWING,
    label: "Following",
    href: `/?tab=${TabsType.FOLLOWING}`,
  },
];

const Tabs = ({ activeTab }: { activeTab: string }) => {
  const router = useRouter();

  const handleClick = (tab: string) => {
    if (activeTab === tab) return;
    router.push(`/?tab=${tab}`);
  };

  useEffect(() => {
    if (activeTab) {
      router.push(`/?tab=${activeTab}`);
    }
  }, [activeTab, router]);

  return (
    <nav className="flex items-center w-full h-[56px]  border-b-[1px] border-black dark:border-white/50 mt-2 md:mt-0">
      {DESKTOP_TABS.map((tab) => (
        <Button
          key={tab.id}
          variant={"ghost"}
          className="w-full relative h-full rounded-none hover:bg-white/10 dark:hover:bg-white/5"
          onClick={() => handleClick(tab.id)}
        >
          {activeTab === tab.id && (
            <div className="h-[2px] bg-accent-foreground absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2  w-[50%]"></div>
          )}
          {tab.label}
        </Button>
      ))}
    </nav>
  );
};

export default Tabs;
