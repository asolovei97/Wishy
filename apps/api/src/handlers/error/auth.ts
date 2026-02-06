import { NextFunction, Request, Response } from "express";
import { AppError, AuthError } from "../../lib";

class BaseAuthErrorHandler {
  private errors = {
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    NO_LOCAL_ACCOUNT: "NO_LOCAL_ACCOUNT",
    INVALID_PROVIDER: "INVALID_PROVIDER",
    NOT_AN_ADMIN: "NOT_AN_ADMIN",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    INVALID_TOKEN: "INVALID_TOKEN",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
  } as const;

  public clientError = (error: string, code = 400): never => {
    throw new AppError(error, code);
  };

  public alreadyExists = (): never => {
    throw new AuthError(this.errors.USER_ALREADY_EXISTS);
  };

  public unauthorized = (): never => {
    throw new AuthError(this.errors.UNAUTHORIZED);
  };

  public forbidden = (): never => {
    throw new AuthError(this.errors.FORBIDDEN, 403);
  };

  public notFound = (): never => {
    throw new AuthError(this.errors.NOT_FOUND, 404);
  };

  private handleJWTError = (): never => {
    throw new AuthError(this.errors.INVALID_TOKEN, 401);
  };

  private handleJWTExpiredError = (): never => {
    throw new AuthError(this.errors.TOKEN_EXPIRED, 401);
  };

  public invalideProvider = (): never => {
    throw new AuthError(this.errors.INVALID_PROVIDER, 400);
  };

  public fail = (error: string | Error): never => {
    if (typeof error === "string") {
      throw new AppError(error, 500);
    }
    throw error;
  };
}

export const authHandleError = new BaseAuthErrorHandler();
