import { Request, Response } from "express";
import { prisma } from "@api/lib/prisma/client";
import { itemError } from "../error/item";
import { QueryFeatures } from "@api/lib/queryFeatures";
import { BaseHandler } from "../base";

class ItemHandler extends BaseHandler {
  public create = this.catch(async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    const { userId } = (req as any).user;
    const {
      name,
      description,
      price,
      currency,
      imageUrl,
      source_url,
    } = req.body;

    const wishlist = await prisma.wishlist.findUnique({ where: { id: wishlistId } });
    if (!wishlist) return itemError.notFound(); // Or wishlistError
    if (wishlist.user_id !== userId) return itemError.forbidden();

    let parsedItemId = null;
    let isParsed = !!source_url;

    if (isParsed && source_url) {
      // Logic for parsed item
      let parsedItem = await prisma.parsedItem.findUnique({
        where: { source_url },
      });

      if (!parsedItem) {
        parsedItem = await prisma.parsedItem.create({
          data: {
            source_url,
            name,
            description,
            price,
            currency,
            imageUrl,
          },
        });
      }
      parsedItemId = parsedItem.id;
    }

    const item = await prisma.item.create({
      data: {
        wishlist_id: wishlistId,
        name,
        description,
        price,
        currency,
        imageUrl,
        source_url,
        is_parsed: isParsed,
        parsed_item_id: parsedItemId,
      },
    });

    return this.created(res, {
      status: "success",
      data: { item },
    });
  });

  public getAll = this.catch(async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    
    // Check wishlist access
    const wishlist = await prisma.wishlist.findUnique({ where: { id: wishlistId } });
     if (!wishlist) return itemError.notFound();
     
     // Public/Private check
     const { userId } = (req as any).user; // Might be undefined if public route?
     // Assuming protected route for now or handling optional auth
     
     if (wishlist.is_private && wishlist.user_id !== userId) {
         return itemError.forbidden();
     }


    const initialQuery: any = { where: { wishlist_id: wishlistId } };
    const queryBuilder = new QueryFeatures(initialQuery, req.query)
      .filter()
      .sort()
      .paginate();

    const items = await prisma.item.findMany(queryBuilder.query);

    return this.ok(res, {
      status: "success",
      results: items.length,
      data: { items },
    });
  });

  public update = this.catch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;
    
    // Verify item belongs to wishlist and wishlist belongs to user
    const item = await prisma.item.findUnique({
        where: { id },
        include: { wishlist: true }
    });

    if(!item) return itemError.notFound();
    if(item.wishlist.user_id !== userId) return itemError.forbidden();

    const updatedItem = await prisma.item.update({
        where: { id },
        data: req.body
    });

    return this.ok(res, {
        status: "success",
        data: { item: updatedItem }
    });
  });

  public delete = this.catch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as any).user;

    const item = await prisma.item.findUnique({
        where: { id },
        include: { wishlist: true }
    });

    if(!item) return itemError.notFound();
    if(item.wishlist.user_id !== userId) return itemError.forbidden();

    await prisma.item.delete({ where: { id } });

    return res.status(204).json({
        status: "success",
        data: null
    });
  });
}

export const itemHandler = new ItemHandler();
