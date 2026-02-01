import { Router } from "express";
import v1Router from './v1'

const router: Router = Router();

router.use("/admin", v1Router);

export default router;