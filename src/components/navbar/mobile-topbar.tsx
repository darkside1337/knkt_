import LogoVector from "@/assets/logo";
import Link from "next/link";
import React from "react";
import Avatar from "../avatar";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const MobileTopBar = ({
  handleDrawerState,
  className = "",
}: {
  handleDrawerState: () => void;
  className?: string;
}) => {
  const { data: session } = useSession();
  let image, username;
  if (!session || !session.user) {
    image = "";
    username = "U";
  }

  if (session && session.user) {
    image = session.user.image;
    username = session.user.username ?? "U";
  }

  return (
    <div className={cn("py-2 px-4 items-center h-fit", className)}>
      <nav className="flex justify-between relative">
        <Button variant={"ghost"} onClick={handleDrawerState} className="p-2">
          <Avatar imageUrl={image} username={username || "U"} />
        </Button>
        <Link href="/" className="absolute top-0 left-[50%] -translate-x-1/2">
          <LogoVector className="size-12 rounded-full" />
        </Link>
        <Button
          variant="ghost"
          className="text-blue-400 font-bold text-[15px] hover:text-accent-foreground p-0"
        >
          Get Premium
        </Button>
      </nav>
    </div>
  );
};

export default MobileTopBar;
