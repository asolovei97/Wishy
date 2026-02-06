import { Request, Response } from "express";
import { prisma } from "@api/lib/prisma/client";
import { BaseAuthHandler } from "./base";
import { authHandleError, HandleError } from "../error";

class ClientAuthHandler extends BaseAuthHandler {
  handleRegister = async (req: Request, res: Response) => {
    const { email, password, first_name, last_name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return authHandleError.alreadyExists();
    }

    if(!password || !first_name) {
      return HandleError.badRequest();
    }
  
    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        role: "USER",
        accounts: {
          create: {
            type: "credentials",
            provider: "local",
            provider_account_id: email,
            password_hash: hashedPassword,
          },
        },
      },
    });

    return this.createSendToken(user, 201, res);
  };

  handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.findUserByEmail(email);

    if (!user) {
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

  handleSocial = async (req: Request, res: Response) => {
    const { provider, providerId, email, firstName, lastName, avatarUrl } =
      req.body;

    if (!["google", "apple"].includes(provider)) {
      return authHandleError.invalideProvider();
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          {
            accounts: { some: { provider, provider_account_id: providerId } },
          },
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          role: "USER",
          accounts: {
            create: {
              type: "oauth",
              provider,
              provider_account_id: providerId,
            },
          },
        },
      });
    } else {
      const account = await prisma.account.findFirst({
        where: {
          user_id: user.id,
          provider,
          provider_account_id: providerId,
        },
      });

      if (!account) {
        await prisma.account.create({
          data: {
            user_id: user.id,
            type: "oauth",
            provider,
            provider_account_id: providerId,
          },
        });
      }
    }

    return this.createSendToken(user, 200, res);
  };
}

export const clientAuthHandler = new ClientAuthHandler();
