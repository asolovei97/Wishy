import { Router } from "express";
import { parserHandler } from "@api/handlers/parser/";
// Maybe add a validation schema later if needed, for now handler checks URL existence.

const router: Router = Router();

router.post(
  "/parse",
  // validation middleware here?
  parserHandler.parse
);

export default router;
