"use client";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileTopBar from "./mobile-topbar";
import MobileBottomBar from "./mobile-bottombar";
import MobileSidebar from "./mobile-sidebar";
import TabletSidebar from "./tablet-sidebar";
import DesktopSidebar from "./desktop-sidebar";

const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDrawerState = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className={cn("relative")}>
      {/* mobile navigation */}
      {/* mobile topbar */}
      <MobileTopBar handleDrawerState={handleDrawerState} />
      {/* mobile bottombar */}
      <MobileBottomBar pathname={pathname} />
      {/*  Mobile sidebar */}
      <MobileSidebar
        isSidebarOpen={isSidebarOpen}
        handleDrawerState={handleDrawerState}
        pathname={pathname}
      />
      {/* ==================================================== */}
      {/* tablet navigation */}
      <TabletSidebar />
      {/* desktop navigation */}
      <DesktopSidebar />
    </header>
  );
};

export default Navbar;
