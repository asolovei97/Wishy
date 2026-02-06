import { AppError } from "@api/lib";

class UserError {
  private errors = {
    NOT_FOUND: "USER_NOT_FOUND",
    FORBIDDEN: "USER_FORBIDDEN",
  } as const;

  public notFound = (): never => {
    throw new AppError(this.errors.NOT_FOUND, 404);
  };

  public forbidden = (): never => {
    throw new AppError(this.errors.FORBIDDEN, 403);
  };
}

export const userError = new UserError();
