import { User } from "@api/generated/prisma/client";
import { BaseHandler } from "../base";
import { prisma } from "@api/lib";

export abstract class BaseUserHandler extends BaseHandler {
  protected findByUserId = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  };

  protected formmatFullUserResponse = (user: User) => {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      settings: user.settings,
    };
  };

  protected formatUserResponse = (user: User) => {
    return {
      id: user.id,
      email: user.email,
      role: user.role,  
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
    };
  };
}