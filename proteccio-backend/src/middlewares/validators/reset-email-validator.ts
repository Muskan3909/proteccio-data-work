import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import {isValidateEmail} from "../../shared/utils";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {email} = req.body;
  if (!email)
    return res.status(200).send(new ServerResponse(false, null, "Email is required"));

  if (!isValidateEmail(email))
    return res.status(200).send(new ServerResponse(false, null, "Invalid email address"));

  return next();
}
