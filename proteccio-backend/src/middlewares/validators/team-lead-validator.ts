import { NextFunction } from "express";
import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { isTeamLeadFromSession } from "../../shared/team-permissions";

/**
 * Middleware to check if the authenticated user has Team Lead role
 * Returns 401 if not authenticated, 403 if not a team lead
 */
export async function requireTeamLead(
  req: IProteccioRequest,
  res: IProteccioResponse,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    
    if (!isTeamLeadFromSession(req.user)) {
      return res.status(403).send("Access denied. Team Lead role required.");
    }
    
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
}

/**
 * Middleware to check if the authenticated user has Team Lead, Admin, or Owner role
 * Returns 401 if not authenticated, 403 if doesn't have required privileges
 */
export async function requireTeamLeadOrAdmin(
  req: IProteccioRequest,
  res: IProteccioResponse,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    
    const hasAccess = req.user.owner || req.user.is_admin || isTeamLeadFromSession(req.user);
    
    if (!hasAccess) {
      return res.status(403).send("Access denied. Team Lead, Admin, or Owner role required.");
    }
    
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
}

