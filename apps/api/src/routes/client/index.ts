import { Router } from "express";
import v1Router from './v1'

const router: Router = Router();

router.use("/client", v1Router);

export default router;