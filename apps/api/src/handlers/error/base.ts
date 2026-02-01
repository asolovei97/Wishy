import { Request, Response, NextFunction } from "express";
import { AppError } from "../../lib/appError";

class BaseErrorHandler {
  private errors = {
    BAD_REQUEST: "BAD_REQUEST",
  } as const;

  public badRequest = (): never => {
    throw new AppError(this.errors.BAD_REQUEST, 400);
  };

  private handleValidationErrorDB = (err: any): AppError => {
    const validationErrors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${validationErrors.join(". ")}`;
    return new AppError(message, 400);
  };

  private sendErrorDev = (err: any, res: Response): void => {
    console.error("ERROR 💥", err.stack);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : "Something went wrong!",
    });
  };

  private sendErrorProd = (err: any, res: Response): void => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  };

  public handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
      this.sendErrorDev(err, res);
    } else {
      let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
      error.message = err.message;

      if (error.name === "ValidationError") error = this.handleValidationErrorDB(error);

      this.sendErrorProd(error, res);
    }
  };
}

export const HandleError =  new BaseErrorHandler();
