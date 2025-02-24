import { Router } from 'express';
//import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DemoplotController } from './controller';
import { DemoplotService } from '../services';

export class DemoplotRoutes {
    static get routes(): Router {
        const router = Router();
        const demoplotService = new DemoplotService();
        const controller = new DemoplotController(demoplotService);

        router.get('/', controller.getDemoplots);
        router.get('/web', controller.getDemoplotsByPage);
        router.get('/tiendas', controller.getUniquePuntosContactoByFilters);
        router.get('/:id', controller.getDemoplotById);
        router.get('/gte/:idGte', controller.getDemoplotsByGteId);
        router.get('/app/gte/:idGte', controller.getDemoplotsByGteId2);
        router.get(
            '/gte/:anio/:mes/:idGte',
            controller.getDemoplotsByAnioMesGte
        );
        router.get('/count/:idUsuario', controller.countDemoplotsByGte);
        router.get(
            '/count/:anio/:mes/:idUsuario',
            controller.countDemoplotsByMesAnioGte
        );
        router.get(
            '/count/gte/:anio/:mes/:idGte',
            controller.getDemoplotStatsByGteWithRankVariable
        );
        router.get(
            '/count/rtc/:anio/:mes/:idUsuario',
            controller.countDemoplotsByMesAnioRtc
        );
        router.get('/rankings/gte', controller.getGteRankings);
        router.get(
            '/rankings/gte/:anio/:mes',
            controller.getGteRankingsAnioMes
        );
        router.post('/', controller.createDemoplot);
        router.put('/:id', controller.updateDemoplot);

        return router;
    }
}
