import { logOutUserAction } from "@/actions/authActions";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = React.ComponentProps<typeof Button> & {
  className?: string;
};

const LogoutButton = ({ className, ...props }: LogoutButtonProps) => {
  return (
    <form action={logOutUserAction}>
      <Button type="submit" variant="destructive" className={cn(className)}>
        Sign Out!
      </Button>
    </form>
  );
};

export default LogoutButton;
