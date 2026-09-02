import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {status_id, task_id} = req.params;

  if (!status_id || !task_id)
    return res.status(200).send(new ServerResponse(false, null, "Updating status failed!"));
  return next();
}
