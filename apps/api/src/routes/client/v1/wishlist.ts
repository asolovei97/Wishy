import { Router } from "express";
import { wishlistHandler, WishlistValidation } from "@api/handlers/wishlist";
import { itemHandler, ItemValidation } from "@api/handlers/item";
import { validateRequest } from "@api/middleware";
import { protect } from "@api/middleware/auth";

const router: Router = Router();


router.use(protect);


router
  .route("/")
  .get(wishlistHandler.getAll)
  .post(
    WishlistValidation.create,
    validateRequest,
    wishlistHandler.create
  );

router
  .route("/:id")
  .get(wishlistHandler.getOne)
  .patch(
    WishlistValidation.update,
    validateRequest,
    wishlistHandler.update
  )
  .delete(wishlistHandler.delete);

router.post(
  "/:wishlistId/items",
  ItemValidation.create,
  validateRequest,
  itemHandler.create
);

router.get(
  "/:wishlistId/items",
  itemHandler.getAll
);

export default router;
