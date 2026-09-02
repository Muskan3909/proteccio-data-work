import ProteccioControllerBase from "./Proteccio-controller-base";
import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";
import {NextFunction} from "express";
import FileConstants from "../shared/file-constants";
import {isInternalServer, isProduction, log_error} from "../shared/utils";
import db from "../config/db";
import createHttpError from "http-errors";

export default class IndexController extends ProteccioControllerBase {
  public static use(req: IProteccioRequest, res: IProteccioResponse, next: NextFunction) {
    try {
      const url = `https://${req.hostname}${req.url}`;
      res.locals.release = FileConstants.getRelease();
      res.locals.user = req.user;
      res.locals.url = url;
      res.locals.env = process.env.NODE_ENV;
      res.locals.isInternalServer = isInternalServer;
      res.locals.isProduction = isProduction;
    } catch (error) {
      console.error(error);
    }
    next();
  }

  public static async index(req: IProteccioRequest, res: IProteccioResponse) {
    const q = `SELECT free_tier_storage, team_member_limit, projects_limit, trial_duration FROM licensing_settings;`;
    const result = await db.query(q, []);
    const [settings] = result.rows;
    res.render("index", {settings});
  }

  public static pricing(req: IProteccioRequest, res: IProteccioResponse) {
    res.render("pricing");
  }

  public static privacyPolicy(req: IProteccioRequest, res: IProteccioResponse) {
    res.render("privacy-policy");
  }

  public static termsOfUse(req: IProteccioRequest, res: IProteccioResponse) {
    res.render("terms-of-use");
  }

  public static admin(req: IProteccioRequest, res: IProteccioResponse) {
    res.render("admin");
  }

  public static auth(req: IProteccioRequest, res: IProteccioResponse) {
    if (req.isAuthenticated())
      return res.redirect("/proteccio");
    return res.render("admin");
  }

  public static Proteccio(req: IProteccioRequest, res: IProteccioResponse) {
    if (req.isAuthenticated())
      return res.render("admin");

    if (req.user && !req.user.is_member)
      return res.redirect("/teams");

    return res.redirect(301, "/auth");
  }

  public static redirectToLogin(req: IProteccioRequest, res: IProteccioResponse) {
    res.redirect("/auth/login");
  }

  public static async signup(req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): Promise<void> {
    try {
      const teamMemberId = req.query.user as string;
      const q = `SELECT set_active_team_by_member_id($1);`;
      await db.query(q, [teamMemberId || null]);
    } catch (error) {
      log_error(error, req.query);
      return next(createHttpError(500));
    }

    if (req.isAuthenticated())
      return res.redirect("/proteccio");

    return res.render("admin");
  }

  public static async login(req: IProteccioRequest, res: IProteccioResponse, next: NextFunction) {
    // Set active team to invited team
    try {
      const teamId = req.query.team as string; // invited team id
      const userId = req.query.user as string; // invited user's id
      const q = `SELECT set_active_team($1, $2);`;
      await db.query(q, [userId || null, teamId || null]);
    } catch (error) {
      log_error(error, req.query);
      return next(createHttpError(500));
    }

    if (req.isAuthenticated())
      return res.redirect("/proteccio");

    return res.render("admin");
  }
}
