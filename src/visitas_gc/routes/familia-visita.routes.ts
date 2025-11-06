import { Router } from 'express';
import { FamiliaVisitaController } from '../controllers/familia-visita.controller';
import { FamiliaVisitaService } from '../services/familia-visita.service';

export class FamiliaVisitaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new FamiliaVisitaController(
            new FamiliaVisitaService()
        );

        // Solo GETs
        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);

        return router;
    }
}
