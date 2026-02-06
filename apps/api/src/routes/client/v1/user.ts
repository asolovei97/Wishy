import { Router } from "express";
import { userHandler, UserValidation } from "@api/handlers/user";
import { validateRequest } from "@api/middleware";

import { protect } from "@api/middleware/auth"; 

const router: Router = Router();

router.use(protect);


router.get(
  "/me",
  userHandler.getCurrentUser
);

router.get(
  "/:id",
  userHandler.getUserById
);


router.patch(
  "/me",
  UserValidation.update,
  validateRequest,
  userHandler.updateCurrentUser
);

export default router;
