import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import {sanitizePlainText} from "../../shared/utils";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {name, project_id} = req.body;
  if (!name)
    return res.status(200).send(new ServerResponse(false, null, "Name is required"));
  if (!project_id)
    return res.status(200).send(new ServerResponse(false, null, "Project is required"));

  req.body.name = sanitizePlainText(req.body.name);

  return next();
}
