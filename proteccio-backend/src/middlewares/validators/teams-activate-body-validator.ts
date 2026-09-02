import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {id} = req.body;
  if (!id)
    return res.status(200).send(new ServerResponse(false, null, "Invalid team identifier"));
  return next();
}
