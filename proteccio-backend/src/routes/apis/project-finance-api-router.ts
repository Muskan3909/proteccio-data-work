import express from "express";
import ProjectFinanceController from "../../controllers/project-finance-controller";
import safeControllerFunction from "../../shared/safe-controller-function";

const projectFinanceApiRouter = express.Router();

projectFinanceApiRouter.post(
  "/create-project-rate-card-role",
  safeControllerFunction(ProjectFinanceController.createProjectRateCardRole)
);

projectFinanceApiRouter.post(
  "/",
  safeControllerFunction(ProjectFinanceController.createProjectRateCardRoles)
);

projectFinanceApiRouter.get(
  "/project/:projectId",
  safeControllerFunction(ProjectFinanceController.getProjectRateCardRoles)
);

projectFinanceApiRouter.get(
  "/project/:projectId/tasks",
  safeControllerFunction(ProjectFinanceController.getProjectTasks)
);

projectFinanceApiRouter.put(
  "/:id",
  safeControllerFunction(ProjectFinanceController.updateProjectRateCardRole)
);

projectFinanceApiRouter.delete(
  "/:id",
  safeControllerFunction(ProjectFinanceController.deleteProjectRateCardRole)
);

projectFinanceApiRouter.get(
  "/project/:projectId/export",
  safeControllerFunction(ProjectFinanceController.exportProjectFinanceData)
);

projectFinanceApiRouter.put(
  "/project/:projectId/members/:memberId/rate-card-role",
  safeControllerFunction(ProjectFinanceController.assignMemberToRateCardRole)
);

projectFinanceApiRouter.put(
  "/task/:taskId/fixed-cost",
  safeControllerFunction(ProjectFinanceController.updateTaskFixedCost)
);

projectFinanceApiRouter.get(
  "/task/:taskId/breakdown",
  safeControllerFunction(ProjectFinanceController.getTaskBreakdown)
);

export default projectFinanceApiRouter;
