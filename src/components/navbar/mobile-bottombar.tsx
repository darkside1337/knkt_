"use client";
import {
  MOBILE_NAVBAR_HEIGHT_IN_PX,
  MobileBottomBarNavItems,
} from "@/lib/constants";
import React from "react";
import ThemeToggle from "../theming/theme-toggle";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useScrollPosition from "@/hooks/useScrollPosition";
import { usePathname } from "next/navigation";

function NavItem({
  href,
  icon,
  isActive = false,
  ariaLabel,
}: {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  ariaLabel?: string;
}) {
  return (
    <Button
      variant="link"
      size="icon"
      asChild
      className={cn("text-muted-foreground", {
        "text-primary": isActive,
      })}
      aria-label={ariaLabel}
    >
      <Link href={href}>{icon}</Link>
    </Button>
  );
}
const MobileBottomBar = ({ className = "" }: { className?: string }) => {
  const { y } = useScrollPosition();
  const pathname = usePathname();

  const hasScrolledPastTopBar = y > MOBILE_NAVBAR_HEIGHT_IN_PX;
  const hasScrolled = y > 0;
  return (
    <div
      className={cn(
        "h-14  shadow-xl bg-background left-0 active:opacity-100 opacity-100 transition-opacity duration-300 ease-in-out border-t-[1px] border-black dark:border-white",
        {
          "opacity-25": hasScrolled,
        },
        className
      )}
    >
      <nav className="flex h-full justify-around items-center">
        {MobileBottomBarNavItems.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={item.icon}
            isActive={pathname.startsWith(item.href)}
            ariaLabel={item.ariaLabel}
          />
        ))}
        <ThemeToggle />
      </nav>
    </div>
  );
};

export default MobileBottomBar;
