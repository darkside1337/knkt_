"use client";
import React, { useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import MobileTopBar from "./mobile-topbar";
import { usePathname } from "next/navigation";

// Note styles apply only to topbar and not sidebar
const MobileTopbarAndSidebar = ({ className = "" }: { className?: string }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDrawerState = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <MobileTopBar
        /* className="grid md:hidden" */
        className={className}
        handleDrawerState={handleDrawerState}
      />
      <MobileSidebar
        isSidebarOpen={isSidebarOpen}
        handleDrawerState={handleDrawerState}
        pathname={pathname}
      />
    </>
  );
};

export default MobileTopbarAndSidebar;
