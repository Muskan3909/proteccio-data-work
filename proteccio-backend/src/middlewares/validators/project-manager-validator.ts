import {NextFunction} from "express";

import {IProteccioRequest} from "../../interfaces/Proteccio-request";
import {IProteccioResponse} from "../../interfaces/Proteccio-response";
import {ServerResponse} from "../../models/server-response";
import ProjectsController from "../../controllers/projects-controller";
import { isTeamLead } from "../../shared/team-permissions";

export default async function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): Promise<IProteccioResponse | void> {

  let is_project_manager = false;
  let is_team_lead = false;

  if (req.query.current_project_id) {
    const result = await ProjectsController.getProjectManager(req.query.current_project_id as string);
    if (result.length)
      if (req.user && (result[0].team_member_id === req.user?.team_member_id)) is_project_manager = true;
  }

  // Treat Team Leads as Project Managers for project-level actions (finance is separately restricted)
  if (req.user?.id && req.user?.team_id) {
    is_team_lead = await isTeamLead(req.user.id, req.user.team_id);
  }

  if (req.user && (req.user.owner || req.user.is_admin || is_project_manager || is_team_lead))
    return next();
  return res.status(401).send(new ServerResponse(false, null, "You are not authorized to perform this action"));
}

