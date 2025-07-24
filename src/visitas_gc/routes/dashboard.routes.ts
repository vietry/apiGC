import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardService } from '../services/dashboard.service';

export class DashboardVisitasRoutes {
    static get routes(): Router {
        const router = Router();
        const dashboardService = new DashboardService();
        const controller = new DashboardController(dashboardService);

        router.get('/labores', controller.obtenerEstadisticasGestionVisitas);

        return router;
    }
}
