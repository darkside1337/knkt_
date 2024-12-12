import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="w-full h-full bg-primary origin-left animate-[loader_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
