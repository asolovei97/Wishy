import { Router } from "express";
import adminAuthRouter from './auth'

const router: Router = Router();

router.use("/", adminAuthRouter);

export default router;