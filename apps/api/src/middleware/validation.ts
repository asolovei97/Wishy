import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "@api/lib";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(!Object.keys(req.body).length) {
    return next(new AppError("Body is required", 400));
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages.join(". "), 400));
  }

  next();
};
