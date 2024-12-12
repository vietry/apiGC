import { Router } from 'express';
import { FamiliaService } from '../services';
import { FamiliaController } from './controller';

export class FamiliaRoutes {
    static get routes(): Router {
        const router = Router();
        const familiaService = new FamiliaService();
        const controller = new FamiliaController(familiaService);

        // Rutas de familia
        router.get('/', controller.getFamilias);
        router.get('/enfoque', controller.getFamiliasConEnfoque);
        router.get('/escuela', controller.getFamiliasEscuela);
        router.get('/:id', controller.getFamiliaById);

        return router;
    }
}
