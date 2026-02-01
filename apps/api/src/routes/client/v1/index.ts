import { Router } from "express";
import clientAuthRouter from './auth'

const router: Router = Router();

router.use("/", clientAuthRouter);

export default router;