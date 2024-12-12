import { CredentialsSignin } from "next-auth";

export class CustomSignInError extends CredentialsSignin {
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
