import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {name, color_code} = req.body;
  if (!name)
    return res.status(200).send(new ServerResponse(false, null, "Name is required"));
  if (!color_code)
    req.body.color_code = "#767676";

  req.body.done = !!req.body.done;
  return next();
}
