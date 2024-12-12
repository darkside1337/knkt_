import React from "react";
import SearchBar from "./search-bar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
function SubscribeToPremium() {
  return (
    <div className="rounded-lg text-pretty p-6 border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
      <h1 className="text-2xl font-bold ">Subscribe to Premium</h1>
      <p className="">
        Subscribe to unlock new features and if eligible, receive a share of the
        add revenue (this is a fake feature)
      </p>
      <Button className="bg-[#1DA1F2]  hover:bg-[#1DA1F2]/90 text-white font-bold rounded-full">
        Subscribe
      </Button>
    </div>
  );
}

const UtilitySidebar = ({ className = "" }: { className?: string }) => {
  return (
    <aside
      className={cn(
        "px-4 py-8 flex-col gap-8 border-l-[1px] border-black dark:border-white/50",
        className
      )}
    >
      <SearchBar />
      <SubscribeToPremium />
    </aside>
  );
};

export default UtilitySidebar;
