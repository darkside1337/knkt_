import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function SingleAlertDestructive({
  className,
  description,
}: {
  className?: string;
  description: string;
}) {
  return (
    <Alert variant="destructive" className={cn("flex items-center", className)}>
      <ExclamationTriangleIcon className="h-4 w-4 " />
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
