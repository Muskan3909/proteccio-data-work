import db from "../config/db";
import HandleExceptions from "../decorators/handle-exceptions";
import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";
import {ServerResponse} from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";

export default class TaskListColumnsController extends ProteccioControllerBase {
  @HandleExceptions()
  public static async getProjectTaskListColumns(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `
      SELECT name,
             key,
             index,
             pinned,
             (SELECT phase_label FROM projects WHERE id = $1) AS phase_label
      FROM project_task_list_cols
      WHERE project_id = $1
      ORDER BY index;
    `;

    const result = await db.query(q, [req.params.id]);
    const phase = result.rows.find(phase => phase.key === "PHASE");
    if (phase)
      phase.name = phase.phase_label;

    return res.status(200).send(new ServerResponse(true, result.rows));
  }

  @HandleExceptions()
  public static async toggleColumn(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const q = `UPDATE project_task_list_cols
               SET pinned = $3
               WHERE project_id = $1
                 AND key = $2 RETURNING *;`;
    const result = await db.query(q, [req.params.id, req.body.key, !!req.body.pinned]);
    const [data] = result.rows;
    return res.status(200).send(new ServerResponse(true, data));
  }
}
