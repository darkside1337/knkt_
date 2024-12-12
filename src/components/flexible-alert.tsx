import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FlexibleAlertProps {
  state: "success" | "error";
  title?: string;
  message?: string;
  errors?: string[] | string;
}

export default function FlexibleAlert({
  state,
  title,
  message,
  errors,
}: FlexibleAlertProps) {
  const isSuccess = state === "success";
  const alertTitle = title || (isSuccess ? "Success" : "Error");
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <Alert
      variant={isSuccess ? "default" : "destructive"}
      className={cn(
        "w-full max-w-md mx-auto",
        isSuccess
          ? "border-green-500 bg-green-50 text-green-700"
          : "border-red-500 bg-red-50 text-red-700"
      )}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle className="font-semibold">{alertTitle}</AlertTitle>
      <AlertDescription>
        {message ? (
          <p>{message}</p>
        ) : errors ? (
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
