import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";

import db from "../config/db";
import {ServerResponse} from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";

export default class TimezonesController extends ProteccioControllerBase {
  @HandleExceptions()
  public static async get(_req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT id, name, abbrev, utc_offset FROM timezones ORDER BY name;`;
    const result = await db.query(q, []);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }

  @HandleExceptions()
  public static async update(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `UPDATE users SET timezone_id = $2, language = $3 WHERE id = $1;`;
    const result = await db.query(q, [req.user?.id, req.body.timezone, req.body.language]);
    return res.status(200).send(new ServerResponse(true, result.rows, "Updated successfully"));
  }
}
