import { NextFunction, Request, Response } from "express";

export abstract class BaseHandler {
  protected ok = <T>(res: Response, data: T) => {
    return res.status(200).json(data);
  };

  protected created = <T>(res: Response, data: T) => {
    return res.status(201).json(data);
  };

  public catch = (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
}