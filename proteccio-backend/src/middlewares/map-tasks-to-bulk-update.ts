import {NextFunction} from "express";
import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction) {
  // Map string[] -> Array<{ id: string; }>
  req.body.tasks = req.body.tasks.map((id: string) => ({id}));
  return next();
}
