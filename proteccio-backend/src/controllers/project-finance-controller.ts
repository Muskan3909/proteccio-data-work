import Excel from "exceljs";
import { IProteccioRequest } from "../interfaces/Proteccio-request";
import { IProteccioResponse } from "../interfaces/Proteccio-response";
import db from "../config/db";
import { ServerResponse } from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";

export default class ProjectFinanceController extends ProteccioControllerBase {
  private static async ensureRateCardRolesTable(): Promise<void> {
    await db.query(`
      CREATE TABLE IF NOT EXISTS project_rate_card_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        job_title_id UUID NOT NULL REFERENCES job_titles(id) ON DELETE CASCADE,
        rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
        man_day_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, job_title_id)
      );
      CREATE TABLE IF NOT EXISTS project_rate_card_role_members (
        project_rate_card_role_id UUID NOT NULL REFERENCES project_rate_card_roles(id) ON DELETE CASCADE,
        team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
        PRIMARY KEY (project_rate_card_role_id, team_member_id)
      );
    `);
  }

  @HandleExceptions()
  public static async createProjectRateCardRole(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { project_id, job_title_id, rate = 0, man_day_rate = 0 } = req.body;
    await ProjectFinanceController.ensureRateCardRolesTable();
    const result = await db.query(
      `INSERT INTO project_rate_card_roles (project_id, job_title_id, rate, man_day_rate)
       SELECT $1, $2, $3, $4
       WHERE EXISTS (SELECT 1 FROM projects WHERE id = $1 AND team_id = $5)
       ON CONFLICT (project_id, job_title_id) DO UPDATE
       SET rate = EXCLUDED.rate, man_day_rate = EXCLUDED.man_day_rate
       RETURNING id, project_id, job_title_id, rate, man_day_rate;`,
      [project_id, job_title_id, rate, man_day_rate, req.user?.team_id || null]
    );
    const role = result.rows[0];
    if (!role) return res.status(404).send(new ServerResponse(false, null));
    return res.status(200).send(new ServerResponse(true, { ...role, members: [] }));
  }

  @HandleExceptions()
  public static async createProjectRateCardRoles(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { project_id, roles = [] } = req.body;
    await ProjectFinanceController.ensureRateCardRolesTable();
    const savedRoles = [];

    for (const role of roles) {
      const result = await db.query(
        `INSERT INTO project_rate_card_roles (project_id, job_title_id, rate, man_day_rate)
         SELECT $1, $2, $3, $4
         WHERE EXISTS (SELECT 1 FROM projects WHERE id = $1 AND team_id = $5)
         ON CONFLICT (project_id, job_title_id) DO UPDATE
         SET rate = EXCLUDED.rate, man_day_rate = EXCLUDED.man_day_rate
         RETURNING id, project_id, job_title_id, rate, man_day_rate;`,
        [project_id, role.job_title_id, Number(role.rate || 0), Number(role.man_day_rate || 0), req.user?.team_id || null]
      );
      if (result.rows[0]) savedRoles.push({ ...result.rows[0], members: [] });
    }

    return res.status(200).send(new ServerResponse(true, savedRoles));
  }

  @HandleExceptions()
  public static async getProjectRateCardRoles(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { projectId } = req.params;
    await ProjectFinanceController.ensureRateCardRolesTable();
    const result = await db.query(
            `SELECT r.id, r.project_id, r.job_title_id, jt.name AS jobtitle,
              r.rate, r.man_day_rate,
              COALESCE((SELECT json_agg(m.team_member_id)
            FROM project_rate_card_role_members m
            WHERE m.project_rate_card_role_id = r.id), '[]'::json) AS members
       FROM project_rate_card_roles r
       INNER JOIN job_titles jt ON jt.id = r.job_title_id
       INNER JOIN projects p ON p.id = r.project_id AND p.team_id = $2
       WHERE r.project_id = $1
       ORDER BY jt.name;`,
      [projectId, req.user?.team_id || null]
    );
    return res.status(200).send(
      new ServerResponse(true, result.rows)
    );
  }

  @HandleExceptions()
  public static async updateProjectRateCardRole(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { id } = req.params;
    const rate = Number(req.body?.rate || 0);
    const manDayRate = Number(req.body?.man_day_rate || 0);
    const result = await db.query(
      `UPDATE project_rate_card_roles AS r
       SET rate = $1, man_day_rate = $2
       FROM projects p
       WHERE r.id = $3 AND p.id = r.project_id AND p.team_id = $4
      RETURNING r.id, r.project_id, r.job_title_id, r.rate, r.man_day_rate,
           (SELECT name FROM job_titles WHERE id = r.job_title_id) AS jobtitle,
           COALESCE((SELECT json_agg(m.team_member_id)
                FROM project_rate_card_role_members m
                WHERE m.project_rate_card_role_id = r.id), '[]'::json) AS members;`,
      [rate, manDayRate, id, req.user?.team_id || null]
    );
    if (!result.rows[0]) return res.status(404).send(new ServerResponse(false, null, "Rate card role not found"));
    return res.status(200).send(new ServerResponse(true, result.rows[0]));
  }

  @HandleExceptions()
  public static async deleteProjectRateCardRole(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const result = await db.query(
      `DELETE FROM project_rate_card_roles AS r
       USING projects p
       WHERE r.id = $1 AND p.id = r.project_id AND p.team_id = $2
       RETURNING r.id, r.project_id, r.job_title_id, r.rate, r.man_day_rate;`,
      [req.params.id, req.user?.team_id || null]
    );
    if (!result.rows[0]) return res.status(404).send(new ServerResponse(false, null, "Rate card role not found"));
    return res.status(200).send(new ServerResponse(true, result.rows[0]));
  }

  @HandleExceptions()
  public static async assignMemberToRateCardRole(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { projectId, memberId } = req.params;
    const { project_rate_card_role_id: roleId } = req.body;
    await ProjectFinanceController.ensureRateCardRolesTable();
    const roleResult = await db.query(
      `SELECT r.id, pm.team_member_id
       FROM project_rate_card_roles r
       INNER JOIN project_members pm
         ON pm.project_id = r.project_id
        AND (pm.id = $2 OR pm.team_member_id = $2)
       INNER JOIN projects p ON p.id = r.project_id AND p.team_id = $4
       WHERE r.id = $1 AND r.project_id = $3;`,
      [roleId, memberId, projectId, req.user?.team_id || null]
    );
    if (!roleResult.rows[0]) return res.status(404).send(new ServerResponse(false, null, "Rate card role or member not found"));
    const teamMemberId = roleResult.rows[0].team_member_id;

    const existing = await db.query(
      `SELECT 1 FROM project_rate_card_role_members WHERE project_rate_card_role_id = $1 AND team_member_id = $2;`,
      [roleId, teamMemberId]
    );
    if (existing.rows[0]) {
      await db.query(
        `DELETE FROM project_rate_card_role_members WHERE project_rate_card_role_id = $1 AND team_member_id = $2;`,
        [roleId, teamMemberId]
      );
    } else {
      await db.query(
        `INSERT INTO project_rate_card_role_members (project_rate_card_role_id, team_member_id) VALUES ($1, $2);`,
        [roleId, teamMemberId]
      );
    }

    const members = await db.query(
      `SELECT team_member_id AS member_id
       FROM project_rate_card_role_members
       WHERE project_rate_card_role_id = $1
       ORDER BY team_member_id;`,
      [roleId]
    );
    return res.status(200).send(new ServerResponse(true, { members: members.rows.map(row => row.member_id) }));
  }

  @HandleExceptions()
  public static async getProjectTasks(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { projectId } = req.params;
    res.setHeader("Cache-Control", "no-store");
    const result = await db.query(
      `SELECT
         t.id,
         t.name,
         t.total_minutes,
         t.fixed_cost,
         t.project_id,
         t.parent_task_id,
         t.status_id,
         t.billable,
         COALESCE(ts.name, 'Uncategorized') AS status_name,
         '#6b7280' AS status_color,
         COALESCE(logs.total_time_logged_seconds, 0) AS total_time_logged_seconds,
         COALESCE(logs.actual_cost_from_logs, 0) AS actual_cost_from_logs,
         COALESCE(logs.members, '[]'::json) AS members,
         COALESCE((
           SELECT SUM(t.total_minutes * COALESCE(rate_card.rate, 0) / 60)
           FROM tasks_assignees ta
           INNER JOIN team_members assigned_member ON assigned_member.id = ta.team_member_id
           LEFT JOIN project_rate_card_roles rate_card
             ON rate_card.project_id = t.project_id
            AND rate_card.job_title_id = assigned_member.job_title_id
           WHERE ta.task_id = t.id
         ), 0) AS estimated_cost
       FROM tasks t
       LEFT JOIN task_statuses ts ON ts.id = t.status_id
       INNER JOIN projects p ON p.id = t.project_id AND p.team_id = $2
       LEFT JOIN LATERAL (
         SELECT
           SUM(twl.time_spent) AS total_time_logged_seconds,
           SUM(twl.time_spent * COALESCE(rate_card.rate, 0) / 3600) AS actual_cost_from_logs,
           COALESCE((
             SELECT json_agg(member ORDER BY member.name)
             FROM (
               SELECT DISTINCT
                 ta.team_member_id,
                 ta.project_member_id,
                 tmiv.name,
                 tmiv.email,
                 tmiv.avatar_url,
                 tmiv.user_id,
                 tmiv.team_id,
                 COALESCE(rate_card.rate, 0) AS rate,
                 COALESCE(rate_card.man_day_rate, 0) AS man_day_rate,
                 tm.job_title_id,
                 jt.name AS job_title_name
               FROM tasks_assignees ta
               INNER JOIN team_members tm ON tm.id = ta.team_member_id
               LEFT JOIN team_member_info_view tmiv ON tmiv.team_member_id = tm.id
               LEFT JOIN job_titles jt ON jt.id = tm.job_title_id
               LEFT JOIN project_rate_card_roles rate_card
                 ON rate_card.project_id = t.project_id
                AND rate_card.job_title_id = tm.job_title_id
               WHERE ta.task_id = t.id
             ) member
           ), '[]'::json) AS members
         FROM task_work_log twl
         LEFT JOIN team_members log_member ON log_member.user_id = twl.user_id AND log_member.team_id = p.team_id
         LEFT JOIN project_rate_card_roles rate_card
           ON rate_card.project_id = t.project_id
          AND rate_card.job_title_id = log_member.job_title_id
         WHERE twl.task_id = t.id
       ) logs ON true
       WHERE t.project_id = $1
         AND t.archived = false
       ORDER BY t.status_sort_order NULLS LAST, t.sort_order NULLS LAST, t.created_at;`,
      [projectId, req.user?.team_id || null]
    );

    const groups = new Map<string, { group_id: string; group_name: string; color_code: string; color_code_dark: string; tasks: unknown[] }>();
    for (const row of result.rows) {
      const groupId = row.status_id || "uncategorized";
      if (!groups.has(groupId)) {
        groups.set(groupId, {
          group_id: groupId,
          group_name: row.status_name,
          color_code: row.status_color,
          color_code_dark: row.status_color,
          tasks: [],
        });
      }

      groups.get(groupId)?.tasks.push({
        id: row.id,
        name: row.name,
        estimated_seconds: (row.total_minutes || 0) * 60,
        total_minutes: row.total_minutes || 0,
        estimated_hours: `${((row.total_minutes || 0) / 60).toFixed(1)}h`,
        total_time_logged_seconds: Number(row.total_time_logged_seconds || 0),
        total_time_logged: ProjectFinanceController.formatDuration(Number(row.total_time_logged_seconds || 0)),
        estimated_cost: Number(row.estimated_cost || 0),
        actual_cost_from_logs: Number(row.actual_cost_from_logs || 0),
        members: row.members || [],
        billable: row.billable,
        fixed_cost: Number(row.fixed_cost || 0),
        variance: Number(row.estimated_cost || 0) + Number(row.fixed_cost || 0) - Number(row.actual_cost_from_logs || 0) - Number(row.fixed_cost || 0),
        total_budget: Number(row.estimated_cost || 0) + Number(row.fixed_cost || 0),
        total_actual: Number(row.fixed_cost || 0) + Number(row.actual_cost_from_logs || 0),
        sub_tasks_count: 0,
        sub_tasks: [],
        is_sub_task: Boolean(row.parent_task_id),
        parent_task_id: row.parent_task_id,
      });
    }

    const projectResult = await db.query(
      `SELECT p.id, p.name, p.currency, o.calculation_method, p.hours_per_day
       FROM projects p
       INNER JOIN teams tm ON tm.id = p.team_id
       LEFT JOIN organizations o ON o.id = tm.organization_id
       WHERE p.id = $1 AND p.team_id = $2;`,
      [projectId, req.user?.team_id || null]
    );

    const project = projectResult.rows[0] || null;
    return res.status(200).send(
      new ServerResponse(true, {
        groups: Array.from(groups.values()),
        project_rate_cards: [],
        project,
      })
    );
  }

  private static formatDuration(totalSeconds: number): string {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m${remainingSeconds ? ` ${remainingSeconds}s` : ""}`;
  }

  @HandleExceptions()
  public static async updateTaskFixedCost(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const { taskId } = req.params;
    const fixedCost = Number(req.body?.fixed_cost);

    if (!Number.isFinite(fixedCost) || fixedCost < 0) {
      return res.status(400).send(new ServerResponse(false, null, "Fixed cost must be a non-negative number"));
    }

    const result = await db.query(
      `UPDATE tasks AS t
       SET fixed_cost = $1, updated_at = NOW()
       FROM projects AS p
       WHERE t.id = $2
         AND p.id = t.project_id
         AND p.team_id = $3
       RETURNING t.id, t.fixed_cost;`,
      [fixedCost, taskId, req.user?.team_id || null]
    );

    const task = result.rows[0];
    if (!task) return res.status(404).send(new ServerResponse(false, null, "Task not found"));
    return res.status(200).send(new ServerResponse(true, task));
  }

  @HandleExceptions()
  public static async exportProjectFinanceData(req: IProteccioRequest, res: IProteccioResponse): Promise<void> {
    const { projectId } = req.params;
    const billableFilter = String(req.query.billable_filter || "all");
    const groupBy = String(req.query.group_by || "status");

    const billableClause = billableFilter === "all"
      ? ""
      : billableFilter === "billable"
        ? "AND t.billable = true"
        : "AND t.billable = false";

    const projectResult = await db.query(
      `SELECT p.name, p.currency
       FROM projects p
       WHERE p.id = $1 AND p.team_id = $2;`,
      [projectId, req.user?.team_id || null]
    );

    const project = projectResult.rows[0] || { name: "project", currency: "USD" };

    const result = await db.query(
      `SELECT
         t.id,
         t.name,
         t.billable,
         t.total_minutes,
         t.fixed_cost,
         COALESCE(ts.name, 'Uncategorized') AS status_name
       FROM tasks t
       LEFT JOIN task_statuses ts ON ts.id = t.status_id
       INNER JOIN projects p ON p.id = t.project_id AND p.team_id = $3
       WHERE t.project_id = $1
         AND t.archived = false
         ${billableClause}
       ORDER BY t.status_sort_order NULLS LAST, t.sort_order NULLS LAST, t.created_at;`,
      [projectId, groupBy, req.user?.team_id || null]
    );

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Finance");

    sheet.columns = [
      { header: "Task", key: "task", width: 32 },
      { header: "Status", key: "status", width: 18 },
      { header: "Billable", key: "billable", width: 12 },
      { header: "Estimated Hours", key: "estimated_hours", width: 16 },
      { header: "Fixed Cost", key: "fixed_cost", width: 16 },
      { header: "Total Budget", key: "total_budget", width: 16 },
      { header: "Total Actual", key: "total_actual", width: 16 },
      { header: "Variance", key: "variance", width: 16 },
    ];

    sheet.getRow(1).values = ["Project", "Currency", "Exported At"];
    sheet.getRow(1).font = { bold: true };
    sheet.getCell("A2").value = project.name;
    sheet.getCell("B2").value = project.currency || "USD";
    sheet.getCell("C2").value = new Date().toISOString();

    sheet.getRow(4).values = [
      "Task",
      "Status",
      "Billable",
      "Estimated Hours",
      "Fixed Cost",
      "Total Budget",
      "Total Actual",
      "Variance",
    ];
    sheet.getRow(4).font = { bold: true };

    for (const row of result.rows) {
      const estimatedHours = Number(row.total_minutes || 0) / 60;
      const fixedCost = Number(row.fixed_cost || 0);
      const totalBudget = fixedCost;
      const totalActual = fixedCost;
      const variance = totalActual - totalBudget;

      sheet.addRow({
        task: row.name,
        status: row.status_name || "Uncategorized",
        billable: row.billable ? "Yes" : "No",
        estimated_hours: Number(estimatedHours.toFixed(2)),
        fixed_cost: Number(fixedCost.toFixed(2)),
        total_budget: Number(totalBudget.toFixed(2)),
        total_actual: Number(totalActual.toFixed(2)),
        variance: Number(variance.toFixed(2)),
      });
    }

    const sanitizedProjectName = String(project.name || "project")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_") || "project";

    const fileName = `${sanitizedProjectName}_Finance_Data.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    await workbook.xlsx.write(res);
    res.end();
  }

  @HandleExceptions()
  public static async getTaskBreakdown(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    const result = await db.query(
      `SELECT t.id, t.name, t.project_id, t.billable, t.total_minutes, t.fixed_cost
       FROM tasks AS t
       INNER JOIN projects AS p ON p.id = t.project_id AND p.team_id = $2
       WHERE t.id = $1;`,
      [req.params.taskId, req.user?.team_id || null]
    );

    const task = result.rows[0];
    if (!task) return res.status(404).send(new ServerResponse(false, null, "Task not found"));

    const estimatedHours = Number(task.total_minutes || 0) / 60;
    const fixedCost = Number(task.fixed_cost || 0);
    const memberResult = await db.query(
      `SELECT
         tm.id AS team_member_id,
         COALESCE(tmiv.name, 'Unknown member') AS name,
         COALESCE(jt.name, 'Unassigned role') AS job_role,
         COALESCE(rate_card.rate, 0) AS hourly_rate,
         COALESCE(SUM(twl.time_spent), 0) / 3600 AS logged_hours,
         COALESCE(SUM(twl.time_spent * COALESCE(rate_card.rate, 0) / 3600), 0) AS actual_cost
       FROM tasks_assignees ta
       INNER JOIN team_members tm ON tm.id = ta.team_member_id
       LEFT JOIN team_member_info_view tmiv ON tmiv.team_member_id = tm.id
       LEFT JOIN job_titles jt ON jt.id = tm.job_title_id
       LEFT JOIN project_rate_card_roles rate_card
         ON rate_card.project_id = $2
        AND rate_card.job_title_id = tm.job_title_id
       LEFT JOIN task_work_log twl
         ON twl.task_id = ta.task_id
        AND twl.user_id = tm.user_id
       WHERE ta.task_id = $1
       GROUP BY tm.id, tmiv.name, jt.name, rate_card.rate
       ORDER BY job_role, name;`,
      [req.params.taskId, task.project_id]
    );

    const groupedMembers = new Map<string, { jobRole: string; logged_hours: number; actual_cost: number; members: unknown[] }>();
    for (const member of memberResult.rows) {
      const jobRole = member.job_role || "Unassigned role";
      if (!groupedMembers.has(jobRole)) {
        groupedMembers.set(jobRole, { jobRole, logged_hours: 0, actual_cost: 0, members: [] });
      }
      const group = groupedMembers.get(jobRole)!;
      const loggedHours = Number(member.logged_hours || 0);
      const actualCost = Number(member.actual_cost || 0);
      group.logged_hours += loggedHours;
      group.actual_cost += actualCost;
      group.members.push({
        name: member.name,
        logged_hours: loggedHours,
        hourly_rate: Number(member.hourly_rate || 0),
        actual_cost: actualCost,
      });
    }

    const members = Array.from(groupedMembers.values()).flatMap(group => group.members as unknown[]);
    const actualLaborCost = memberResult.rows.reduce((sum, member) => sum + Number(member.actual_cost || 0), 0);
    const estimatedLaborCost = memberResult.rows.reduce(
      (sum, member) => sum + estimatedHours * Number(member.hourly_rate || 0),
      0
    );
    return res.status(200).send(new ServerResponse(true, {
      task: {
        id: task.id,
        name: task.name,
        project_id: task.project_id,
        billable: task.billable,
        estimated_hours: estimatedHours,
        logged_hours: memberResult.rows.reduce((sum, member) => sum + Number(member.logged_hours || 0), 0),
        estimated_labor_cost: estimatedLaborCost,
        actual_labor_cost: actualLaborCost,
        fixed_cost: fixedCost,
        total_estimated_cost: estimatedLaborCost + fixedCost,
        total_actual_cost: actualLaborCost + fixedCost,
      },
      grouped_members: Array.from(groupedMembers.values()),
      members,
    }));
  }
}
