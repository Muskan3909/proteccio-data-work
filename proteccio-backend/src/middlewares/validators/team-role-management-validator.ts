import { NextFunction } from "express";

import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { ServerResponse } from "../../models/server-response";
import { canManageTeamMembers } from "../../shared/team-permissions";

export default function teamRoleManagementValidator(
  req: IProteccioRequest,
  res: IProteccioResponse,
  next: NextFunction,
): IProteccioResponse | void {
  if (req.user && canManageTeamMembers(req.user)) {
    return next();
  }

  return res
    .status(401)
    .send(
      new ServerResponse(
        false,
        null,
        "You are not authorized to perform this action",
      ),
    );
}
