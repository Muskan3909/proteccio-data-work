import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {tasks} = req.body;
  if (!Array.isArray(tasks))
    return res.status(400).send(new ServerResponse(false, null));

  req.body.labels = Array.isArray(req.body.labels) ? req.body.labels : [];

  return next();
}
