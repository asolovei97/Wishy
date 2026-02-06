import { AppError } from "@api/lib/appError";

class WishlistError {
  private errors = {
    NOT_FOUND: "WISHLIST_NOT_FOUND",
    FORBIDDEN: "WISHLIST_FORBIDDEN",
  } as const;

  public notFound = (): never => {
    throw new AppError(this.errors.NOT_FOUND, 404);
  };

  public forbidden = (): never => {
    throw new AppError(this.errors.FORBIDDEN, 403);
  };
}

export const wishlistError = new WishlistError();
