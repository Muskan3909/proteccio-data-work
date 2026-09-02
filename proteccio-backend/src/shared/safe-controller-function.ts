import {NextFunction, Request, Response} from "express";
import {IProteccioResponse} from "../interfaces/Proteccio-response";

export default (fn: (_req: Request, _res: Response, next: NextFunction) => Promise<IProteccioResponse | void>)

: (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
};
