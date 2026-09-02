import { NextFunction } from "express";

import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {

  const {id, seconds_spent, created_at, formatted_start} = req.body;

  if (!id || !seconds_spent || !formatted_start) return res.sendStatus(400);

  return next();
}
