import { Router } from 'express';
import { LaborVisitaController } from '../controllers/labor-visita.controller';
import { LaborVisitaService } from '../services/labor-visita.service';

export class LaborVisitaRoutes {
    static get routes(): Router {
        const router = Router();
        const laborVisitaService = new LaborVisitaService();
        const controller = new LaborVisitaController(laborVisitaService);

        router.post('/', controller.createLaborVisita);
        router.post('/bulk', controller.createMultipleLaborVisita);
        router.put('/:id', controller.updateLaborVisita);
        router.get('/sublabores', controller.getSubLaboresVisita);
        router.get('/:id', controller.getLaborVisitaById);
        router.get('/visita/:idVisita', controller.getLaborVisitasByVisitaId);

        return router;
    }
}
