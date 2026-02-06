import { Request, Response } from "express";
import { BaseAuthHandler } from "./base";
import { roles as userRoles } from "@enums/user-role";
import { authHandleError } from "../error";

class AdminAuthHandler extends BaseAuthHandler {
  handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.findUserByEmail(email);

    if (!user || user.role !== userRoles.admin) {
     return authHandleError.unauthorized();
    }

    const account = user.accounts[0];
    if (!account || !account.password_hash) {
      return authHandleError.unauthorized();
    }

    const isValid = await this.comparePassword(password, account.password_hash);
    if (!isValid) {
      return authHandleError.unauthorized();
    }

    return this.createSendToken(user, 200, res);
  };
}

export const adminAuthHandler = new AdminAuthHandler();
