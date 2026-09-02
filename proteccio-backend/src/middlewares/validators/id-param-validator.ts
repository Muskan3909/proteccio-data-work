import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import {isValidUuid} from "../../shared/validation-helpers";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  if (!req.params.id) {
    return res.status(400).send(new ServerResponse(false, null, "ID parameter is required"));
  }
  
  if (!isValidUuid(req.params.id)) {
    return res.status(400).send(new ServerResponse(false, null, "Invalid ID format. Must be a valid UUID"));
  }
  
  return next();
}
