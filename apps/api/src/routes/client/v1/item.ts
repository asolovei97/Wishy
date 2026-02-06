import { Router } from "express";
import { itemHandler, ItemValidation } from "@api/handlers/item";
import { validateRequest } from "@api/middleware";
import { protect } from "@api/middleware/auth";

const router: Router = Router();

router.use(protect);

router
  .route("/:id")
  .patch(ItemValidation.update, validateRequest, itemHandler.update)
  .delete(itemHandler.delete);

export default router;
