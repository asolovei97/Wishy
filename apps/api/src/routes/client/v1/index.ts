import { Router } from "express";
import clientAuthRouter from './auth';
import userRouter from './user';
import wishlistRouter from './wishlist';
import itemRouter from './item';
import parserRouter from './parser';

const router: Router = Router();

router.use("/auth", clientAuthRouter);
router.use("/users", userRouter);
router.use("/wishlists", wishlistRouter);
router.use("/items", itemRouter);
router.use("/parser", parserRouter);



export default router;