import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 py-2 md:p-0", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
