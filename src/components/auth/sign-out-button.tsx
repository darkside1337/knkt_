import { Button } from "../ui/button";
import { signOut } from "../../../auth";

const SignOutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirect: true, redirectTo: "/auth/login" });
      }}
    >
      <Button>Sign Out</Button>
    </form>
  );
};

export default SignOutButton;
