import { userError } from "../error";
import { BaseUserHandler } from "./base";
import { Request, Response } from "express";

class UserHandler extends BaseUserHandler  {
    public getCurrentUser = this.catch(async (req: Request, res: Response) => {
        const { userId } = (req as any).user;
        console.log(userId)
        const user = await this.findByUserId(userId);

        if(!user) {
          return userError.notFound();
        }

        return this.ok(res, {
            status: "success",
            data: { user: this.formmatFullUserResponse(user) },
        });
    });

    getUserById = this.catch(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await this.findByUserId(id);
        if(!user) {
          return userError.notFound();
        }
        return this.ok(res, {
            status: "success",
            data: { user: this.formatUserResponse(user) },
        });
    });

    updateCurrentUser = this.catch(async (req: Request, res: Response) => {
        const { userId } = (req as any).user;
        const user = await this.findByUserId(userId);
        if(!user) {
          return userError.notFound();
        }
        return this.ok(res, {
            status: "success",
            data: { user: this.formmatFullUserResponse(user) },
        });
    });
}

export const userHandler = new UserHandler();