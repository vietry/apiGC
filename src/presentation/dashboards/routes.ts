import { Router } from 'express';
import { DashboardService } from '../services';

import { DashboardController } from './controller';

export class DashboardRoutes {
    static get routes(): Router {
        const router = Router();
        const dashboardService = new DashboardService();
        const controller = new DashboardController(dashboardService);

        router.get('/ranking/gds', controller.getGteRankings);
        router.get('/ranking/gds/variable', controller.getGteRankingsVariable);
        router.get('/count/demoplots', controller.countDemoplotsByFilters);
        router.get(
            '/count/demoplots/variable',
            controller.countDemoplotsByFiltersCustomDate
        );
        router.get('/ranking/jerarquia', controller.getJerarquiaRankings);
        router.get('/report/demoplots', controller.getDemoplotReport);
        return router;
    }
}
