import db from "../config/db";
import HandleExceptions from "../decorators/handle-exceptions";
import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";
import {ServerResponse} from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";

export default class AccessControlsController extends ProteccioControllerBase {
  @HandleExceptions()
  public static async getRoles(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT id, name, default_role, admin_role FROM roles WHERE team_id = $1 AND owner IS FALSE ORDER BY name;`;
    const result = await db.query(q, [req.user?.team_id || null]);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }
}
