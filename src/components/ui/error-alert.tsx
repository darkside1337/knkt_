import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { ApiError } from "@/types";

export function AlertDestructive({
  className,
  errors,
}: {
  className?: string;
  title?: string;
  errors: ApiError[];
}) {
  return (
    <Alert variant="destructive" className={className}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription>
        {
          <ul>
            {errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        }
      </AlertDescription>
    </Alert>
  );
}
