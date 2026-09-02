import { NextFunction } from "express";
import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { ServerResponse } from "../../models/server-response";
import { isTeamLead } from "../../shared/team-permissions";

/**
 * Middleware to deny team leads access to finance endpoints
 * Team leads should not have access to project finance data
 */
export default async function teamLeadFinanceValidator(
  req: IProteccioRequest,
  res: IProteccioResponse,
  next: NextFunction
): Promise<IProteccioResponse | void> {
  const userId = req.user?.id;
  const teamId = req.user?.team_id;

  if (!userId || !teamId) {
    return res.status(400).send(new ServerResponse(false, null, "Missing user context"));
  }

  // Check if user is a team lead
  const userIsTeamLead = await isTeamLead(userId, teamId);
  
  if (userIsTeamLead) {
    return res.status(403).send(new ServerResponse(false, null, "Team leads do not have access to project finance"));
  }

  return next();
}
