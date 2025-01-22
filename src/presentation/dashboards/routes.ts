import { Router } from "express";
import { DashboardService } from "../services";

import { DashboardController } from "./controller";

export class DashboardRoutes {
  static get routes(): Router {
    const router = Router();
    const dashboardService = new DashboardService();
    const controller = new DashboardController(dashboardService);

    router.get("/ranking/gds", controller.getGteRankingsAnioMes);
    return router;
  }
}
