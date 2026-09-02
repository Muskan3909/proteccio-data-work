import db from "../config/db";
import HandleExceptions from "../decorators/handle-exceptions";
import { IPassportSession } from "../interfaces/passport-session";

import { IProteccioRequest } from "../interfaces/Proteccio-request";
import { IProteccioResponse } from "../interfaces/Proteccio-response";

import { ServerResponse } from "../models/server-response";
import { NotificationsService } from "../services/notifications/notifications.service";
import { slugify, sanitizePlainText } from "../shared/utils";
import { generateProjectKey } from "../utils/generate-project-key";
import ProteccioControllerBase from "./Proteccio-controller-base";

export default class ProfileSettingsController extends ProteccioControllerBase {
  @HandleExceptions()
  public static async setup(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT complete_account_setup($1, $2, $3) AS account;`;
    req.body.key = generateProjectKey(req.body.project_name, []) || null;
    const result = await db.query(q, [req.user?.id, req.user?.team_id, JSON.stringify(req.body)]);
    const [data] = result.rows;

    if (!data)
      return res.status(200).send(new ServerResponse(false, null, "Account setup failed! Please try again"));

    const newMembers = data.account.members || [];

    // Pass project_id so invitation emails include direct project access link
    NotificationsService.sendTeamMembersInvitations(newMembers, req.user as IPassportSession, data.account.id);

    return res.status(200).send(new ServerResponse(true, data.account));
  }

  @HandleExceptions()
  public static async get(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT name, email
               FROM users
               WHERE id = $1;`;
    const result = await db.query(q, [req.user?.id]);
    const [data] = result.rows;
    return res.status(200).send(new ServerResponse(true, data));
  }

  @HandleExceptions()
  public static async update(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    // Sanitize name to prevent HTML injection (defense in depth - validator should handle this too)
    const sanitizedName = sanitizePlainText(req.body.name);

    const q = `UPDATE users
               SET name       = $2,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $1
               RETURNING id, name, email, updated_at;`;
    const result = await db.query(q, [req.user?.id, sanitizedName]);
    const [data] = result.rows;
    return res.status(200).send(new ServerResponse(true, data));
  }

  @HandleExceptions()
  public static async dismissMobileAppBanner(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    await db.query(`UPDATE users SET mobile_app_banner_dismissed = TRUE WHERE id = $1;`, [req.user?.id]);
    return res.status(200).send(new ServerResponse(true, null));
  }

  @HandleExceptions()
  public static async update_team_name(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT update_team_name($1);`;
    const body = {
      id: req.params.id,
      name: req.body.name,
      key: slugify(req.body.name),
      user_id: req.user?.id
    };
    await db.query(q, [JSON.stringify(body)]);
    return res.status(200).send(new ServerResponse(true, body));
  }
}
