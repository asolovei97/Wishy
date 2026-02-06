import { AppError } from "@api/lib/appError";

class ItemError {
  private errors = {
    NOT_FOUND: "ITEM_NOT_FOUND",
    FORBIDDEN: "ITEM_FORBIDDEN",
  } as const;

  public notFound = (): never => {
    throw new AppError(this.errors.NOT_FOUND, 404);
  };

  public forbidden = (): never => {
    throw new AppError(this.errors.FORBIDDEN, 403);
  };
}

export const itemError = new ItemError();
