"use client"
import LogoVector from "@/assets/logo";
import Link from "next/link";
import {
  FiHome,
  FiSearch,
  FiBell,
  FiMail,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Avatar from "../avatar";
import LogoutButton from "../logout-button";
import { BsThreeDots } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
interface DesktopSidebarProps {
  id?: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const DESKTOP_NAV_ITEMS = [
  {
    id: "home",
    href: "/",
    label: "Home",
    icon: <FiHome className="size-6" />,
    exact: true,
  },
  {
    id: "search",
    href: "/search",
    label: "Search",
    icon: <FiSearch className="size-6" />,
    exact: false,
  },
  {
    id: "notifications",
    href: "/notifications",
    label: "Notifications",
    icon: <FiBell className="size-6" />,
    exact: false,
  },
  {
    id: "messages",
    href: "/messages",
    label: "Messages",
    icon: <FiMail className="size-6" />,
    exact: false,
  },
  {
    id: "profile",
    href: "/profile",
    label: "Profile",
    icon: <FiUser className="size-6" />,
    exact: true,
  },
  {
    id: "settings",
    href: "/profile/settings",
    label: "Settings",
    icon: <FiSettings className="size-6" />,
    exact: true,
  },
];

function DesktopSidebarNavItem({
  href,
  label,
  icon,
  exact = false,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  const handleClick = () => router.push(href);

  return (
    <Button
      className={cn(
        "w-full flex items-center duration-300 transition-colors justify-start gap-4 text-muted-foreground hover:text-primary ",
        {
          "text-primary": isActive,
        }
      )}
      onClick={handleClick}
      variant={"link"}
      aria-label={`navigate to ${label}`}
    >
      {icon}
      <p>{label}</p>
    </Button>
  );
}
function DesktopAvatarDropdown({}: {}) {
  const { data: session } = useSession();
  const { username, image, displayName } = session.user;
  console.log({
    username,
    image,
    displayName,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="mt-auto flex justify-between px-4 py-6"
        >
          <Avatar imageUrl={image} username={username as string} />
          <div className="flex flex-col items-start">
            <p>{displayName}</p>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
          <BsThreeDots className="size-6" />
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

const DesktopSidebar = ({ className = "" }: { className: string }) => {
  return (
    <nav
      className={cn(
        "lg:flex-col h-dvh w-[275px] px-6 py-8 gap-8 border-r-[1px] border-black dark:border-white/50",
        className
      )}
    >
      <LogoVector className="size-12 rounded-full" />
      {/* // nav items */}

      {DESKTOP_NAV_ITEMS.map((item) => (
        <DesktopSidebarNavItem
          key={item.id}
          href={item.href}
          label={item.label}
          icon={item.icon}
          exact={item.exact}
        />
      ))}

      {/* new post button*/}

      <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-full w-full">
        New Post
      </Button>

      {/* avatar dropdown */}

      <DesktopAvatarDropdown />
    </nav>
  );
};

export default DesktopSidebar;
