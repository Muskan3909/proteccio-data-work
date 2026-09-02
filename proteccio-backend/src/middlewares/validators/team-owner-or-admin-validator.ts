import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import { getEffectiveTeamRole, TEAM_ROLE_NAMES } from "../../shared/team-permissions";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const currentRole = getEffectiveTeamRole(req.user);

  if (
    req.user &&
    (currentRole === TEAM_ROLE_NAMES.OWNER || currentRole === TEAM_ROLE_NAMES.ADMIN)
  )
    return next();
  return res.status(401).send(new ServerResponse(false, null, "You are not authorized to perform this action"));
}
