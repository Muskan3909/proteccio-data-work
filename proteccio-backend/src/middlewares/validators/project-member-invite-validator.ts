import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import {isValidateEmail} from "../../shared/utils";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {project_id, email} = req.body;
  if (!project_id || !isValidateEmail(email))
    return res.status(400).send(new ServerResponse(false, null));
  return next();
}
