import { Router } from "express";
import { clientAuthHandler } from "@api/handlers/auth";
import { protect, validateRequest } from "@api/middleware";
import { AuthValidation } from "@api/handlers/auth/validation";

const router: Router = Router();

router.use(validateRequest);

router.post(
  "/register",
  AuthValidation.create,
  clientAuthHandler.catch(clientAuthHandler.handleRegister)
);

router.post(
  "/login",
  clientAuthHandler.catch(clientAuthHandler.handleLogin)
);

router.post(
  "/social",
  clientAuthHandler.catch(clientAuthHandler.handleSocial)
);

router.use(protect);

router.patch(
  "/change-password",
  AuthValidation.updatePassword,
  clientAuthHandler.updatePassword
);

router.get("/logout", clientAuthHandler.logout);

export default router;
