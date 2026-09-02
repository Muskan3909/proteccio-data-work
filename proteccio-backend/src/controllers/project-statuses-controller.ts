import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";

import db from "../config/db";
import {ServerResponse} from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";

export default class ProjectstatusesController extends ProteccioControllerBase {
  @HandleExceptions()
  public static async get(_req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `SELECT id, name, color_code, icon, is_default FROM sys_project_statuses ORDER BY sort_order;`;
    const result = await db.query(q, []);
    return res.status(200).send(new ServerResponse(true, result.rows));
  }
}
