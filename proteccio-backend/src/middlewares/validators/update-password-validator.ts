import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {hash, password, user} = req.body;
  if (!password)
    return res.status(200).send(new ServerResponse(false, null, "Password is required"));

  if (!hash || !user)
    return res.status(200).send(new ServerResponse(false, null, "An unknown error has occurred. Please try again."));
  return next();
}
