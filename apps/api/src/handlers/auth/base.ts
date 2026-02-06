import { NextFunction, Request, Response } from "express";
import { comparePassword, generateToken, hashPassword } from "@api/lib/auth";
import { prisma } from "@api/lib/prisma/client";
import { DateTime } from "luxon";

export abstract class BaseAuthHandler {
  protected createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieOptions = {
      expires: DateTime.now().plus({ hours: 72 }).toJSDate(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
      status: "success",
      user: this.formatUserResponse(user),
    });
  };

  public logout = (req: Request, res: Response) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  };
  protected ok = <T>(res: Response, data: T) => {
    return res.status(200).json(data);
  };

  protected created = <T>(res: Response, data: T) => {
    return res.status(201).json(data);
  };

  protected hashPassword = async (password: string) => {
    return hashPassword(password);
  };

  protected comparePassword = async (password: string, hash: string) => {
    return comparePassword(password, hash);
  };

  protected generateToken = (payload: {
    userId: string;
    email: string;
    role: string;
  }) => {
    return generateToken(payload);
  };

  protected findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: "local" },
        },
      },
    });
  };

  protected formatUserResponse = (user: {
    id: string;
    email: string;
    role: string;
  }) => {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  };

  public catch = (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
}
