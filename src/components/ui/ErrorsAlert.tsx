import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function ErrorsAlert({
  className,
  errors,
}: {
  className?: string;
  title?: string;
  errors: string[];
}) {
  return (
    <Alert variant="destructive" className={className}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription>
        {
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        }
      </AlertDescription>
    </Alert>
  );
}
