import LogoVector from "@/assets/logo";
import { MobileSideBarNavItems } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { FiXCircle } from "react-icons/fi";
import LogoutButton from "../logout-button";
import ThemeToggle from "../theming/theme-toggle";
import { Drawer, DrawerContent } from "../ui/drawer";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

function SideBarNavItem({
  icon,
  text,
  href,
  isActive = false,
  handleDrawerState,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  isActive: boolean;
  handleDrawerState: () => void;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
    handleDrawerState();
  };

  return (
    <Button
      variant="link"
      size="icon"
      asChild
      onClick={handleClick}
      className={cn(
        "text-muted-foreground w-full flex items-center gap-4 justify-start hover:text-primary",
        {
          "text-primary": isActive,
        }
      )}
    >
      <Link href={href}>
        {icon}
        <p className="text-lg font-bold">{text}</p>
      </Link>
    </Button>
  );
}

const MobileSidebar = ({
  isSidebarOpen,
  handleDrawerState,
  pathname,
}: {
  isSidebarOpen: boolean;
  handleDrawerState: () => void;
  pathname: string;
}) => {
  return (
    <Drawer
      direction="left"
      open={isSidebarOpen}
      onOpenChange={handleDrawerState}
    >
      <DialogDescription className="sr-only">Mobile sidebar</DialogDescription>
      <DialogTitle className="sr-only">Mobile sidebar</DialogTitle>
      <DrawerContent className="h-dvh w-4/5 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <LogoVector className="size-12 rounded-full" />
          </Link>
          <Button variant="link" size="icon" onClick={handleDrawerState}>
            <FiXCircle className="h-8 w-8" />
          </Button>
        </div>
        <nav className="flex flex-col gap-4 mt-8">
          {MobileSideBarNavItems.map((item) => (
            <SideBarNavItem
              handleDrawerState={handleDrawerState}
              key={item.id}
              href={item.href}
              icon={item.icon}
              isActive={pathname.startsWith(item.href)}
              text={item.text}
            />
          ))}
          <LogoutButton className="w-full" />
          <ThemeToggle className="mx-auto" />
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
