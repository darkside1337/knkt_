"use client";
import React from "react";
import Link from "next/link";
import LogoVector from "@/assets/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FiBell,
  FiHome,
  FiMail,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import Avatar from "@/components/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/logout-button";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/theming/theme-toggle";
import { cn } from "@/lib/utils";
interface TabletSidebarProps {
  id?: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

const TABLET_SIDEBAR_ITEMS: TabletSidebarProps[] = [
  {
    id: "home",
    href: "/",
    label: "Home",
    icon: <FiHome className="size-6" />,
  },
  {
    id: "search",
    href: "/search",
    label: "Search",
    icon: <FiSearch className="size-6" />,
  },
  {
    id: "notifications",
    href: "/notifications",
    label: "Notifications",
    icon: <FiBell className="size-6" />,
  },
  {
    id: "messages",
    href: "/messages",
    label: "Messages",
    icon: <FiMail className="size-6" />,
  },
  {
    id: "profile",
    href: "/profile",
    label: "Profile",
    icon: <FiUser className="size-6" />,
  },
  {
    id: "settings",
    href: "/profile/settings",
    label: "Settings",
    icon: <FiSettings className="size-6" />,
  },
];

function TabletAvatarDropdown({
  username,
  imageUrl,
}: {
  username: string;
  imageUrl?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="mt-auto">
          <Avatar imageUrl={imageUrl} username={username} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-28">
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TabletSidebarNavItem({ href, label, icon }: TabletSidebarProps) {
  return (
    <Link
      href={href}
      className={buttonVariants({ variant: "ghost" })}
      aria-label={`navigate to ${label}`}
    >
      {icon}
    </Link>
  );
}
const TabletSidebar = ({ className = "" }: { className?: string }) => {
  const { data: session } = useSession();
  return (
    <nav
      className={cn(
        "w-[88px] h-dvh bg-background flex-col items-center gap-8 py-12 border-r-[1px] border-black dark:border-white",
        className
      )}
    >
      <Link href="/" className="w-fit">
        <LogoVector className="size-12 rounded-full" />
      </Link>
      {TABLET_SIDEBAR_ITEMS.map((item) => (
        <TabletSidebarNavItem
          key={item.id}
          href={item.href}
          label={item.label}
          icon={item.icon}
        />
      ))}
      <ThemeToggle />
      <TabletAvatarDropdown
        username={session?.user.username as string}
        imageUrl={session?.user.image as string}
      />
    </nav>
  );
};

export default TabletSidebar;
