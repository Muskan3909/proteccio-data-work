import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {project, replace} = req.query;
  if (!project)
    return res.status(400).send(new ServerResponse(false, null));

  req.query.replace = /null/.test(replace as string) ? null : replace as any;

  return next();
}
