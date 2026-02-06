import { NextFunction, Request, Response } from "express";
import { prisma } from "@api/lib/prisma/client";
import { BaseAuthHandler } from "../auth/base";
import { wishlistError } from "../error/wishlist";
import { QueryFeatures } from "@api/lib/queryFeatures";

class WishlistHandler extends BaseAuthHandler {
  public create = this.catch(async (req: Request, res: Response) => {
    const { userId } = (req as any).user || {};
    const { title, description, event_date, is_private } = req.body;

    const wishlist = await prisma.wishlist.create({
      data: {
        user_id: userId,
        title,
        description,
        event_date,
        is_private: is_private || false,
      },
    });

    return this.created(res, {
      status: "success",
      data: { wishlist },
    });
  });

  public getAll = this.catch(async (req: Request, res: Response) => {
    const { userId } = (req as any).user || {};

    console.log(userId);

    const queryBuilder = new QueryFeatures({}, req.query)
      .filter()
      .sort()
      .paginate();

    const securityCondition = {
      OR: [{ is_private: false }, { user_id: userId }],
    };

    // Safely merge security condition with filters from query
    queryBuilder.query.where = {
      AND: [queryBuilder.query.where || {}, securityCondition],
    };

    const wishlists = await prisma.wishlist.findMany(queryBuilder.query);

    return this.ok(res, {
      status: "success",
      results: wishlists.length,
      data: { wishlists },
    });
  });

  public getOne = this.catch(async (req: Request, res: Response) => {
    const { id } = (req.params as { id: string }) || {};

    const { userId } = (req as any).user;

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        id,
        OR: [{ is_private: false }, { user_id: userId }],
      },
      include: { items: true },
    });

    if (!wishlist) {
      return wishlistError.notFound();
    }

    return this.ok(res, {
      status: "success",
      data: { wishlist },
    });
  });

  public update = this.catch(async (req: Request, res: Response) => {
    const { id } = (req.params as { id: string }) || {};
    const { userId } = (req as any).user;

    const wishlist = await prisma.wishlist.findUnique({ where: { id } });

    if (!wishlist) return wishlistError.notFound();
    if (wishlist.user_id !== userId) return wishlistError.forbidden();

    const updatedWishlist = await prisma.wishlist.update({
      where: { id },
      data: req.body,
    });

    return this.ok(res, {
      status: "success",
      data: { wishlist: updatedWishlist },
    });
  });

  public delete = this.catch(async (req: Request, res: Response) => {
    const { id } = (req.params as { id: string }) || {};
    const { userId } = (req as any).user;

    const wishlist = await prisma.wishlist.findUnique({ where: { id } });

    if (!wishlist) return wishlistError.notFound();
    if (wishlist.user_id !== userId) return wishlistError.forbidden();

    await prisma.wishlist.delete({ where: { id } });

    return res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

export const wishlistHandler = new WishlistHandler();
