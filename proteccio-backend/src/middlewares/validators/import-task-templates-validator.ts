import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  if (!req.params.id)
    return res.status(400).send(new ServerResponse(false, null));

  if (!req.body.length)
    return res.status(400).send(new ServerResponse(false, null, "Tasks are required!"));

  return next();
}
