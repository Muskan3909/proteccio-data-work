import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const {project_id, start_date, end_date} = req.query;
  if (!project_id)
    return res.status(200).send(new ServerResponse(false, null, "Project ID is required"));

  if (!start_date)
    return res.status(200).send(new ServerResponse(false, null, "Start date is required"));

  if (!end_date)
    return res.status(200).send(new ServerResponse(false, null, "End date is required"));

  return next();
}
