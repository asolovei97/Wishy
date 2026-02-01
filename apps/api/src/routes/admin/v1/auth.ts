import { Router } from "express";
import { adminAuthHandler } from "@api/handlers/auth";

const router: Router = Router();

router.post("/login", adminAuthHandler.catch(adminAuthHandler.handleLogin));
router.get("/logout", adminAuthHandler.logout);

export default router;
