import { Router } from "express";
import { clientAuthHandler } from "@api/handlers/auth";

const router: Router = Router();

router.post(
  "/register",
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

router.get("/logout", clientAuthHandler.logout);

export default router;
