import { Router } from 'express';
import { CostoLaboralController } from './controller';
import { CostoLaboralService } from '../services';

export class CostoLaboralRoutes {
    static get routes(): Router {
        const router = Router();
        const costoLaboralService = new CostoLaboralService();
        const controller = new CostoLaboralController(costoLaboralService);

        router.get('/', controller.getCostosLaborales);
        router.get('/all', controller.getAllCostosLaborales);
        router.get('/:id', controller.getCostoLaboralById);
        router.post('/', controller.createCostoLaboral);
        router.put('/:id', controller.updateCostoLaboral);

        return router;
    }
}
