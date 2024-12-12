import React from "react";
import { Input } from "./ui/input";
import { FiSearch } from "react-icons/fi";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const SearchBar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input placeholder="Search" className="w-full" />
      <Button
        variant="ghost"
        size={"icon"}
        className="absolute top-1/2 right-2 -translate-y-1/2 "
      >
        <FiSearch size={24} />
      </Button>
    </div>
  );
};

export default SearchBar;
