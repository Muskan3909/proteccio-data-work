import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {status_id, tasks} = req.body;
  if (!status_id || !Array.isArray(tasks))
    return res.status(400).send(new ServerResponse(false, null));

  return next();
}
