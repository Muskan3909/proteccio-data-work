import { NextFunction } from "express";

import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { ServerResponse } from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const { example_name } = req.body;
  if (!example_name)
    return res.status(200).send(new ServerResponse(false, null, "Name is required"));
  return next();
}