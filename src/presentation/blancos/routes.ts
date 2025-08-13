import { Router } from 'express';
import { BlancoBiologicoController } from './controller';
import { BlancoBiologicoService } from '../services';

export class BlancoBiologicoRoutes {
    static get routes(): Router {
        const router = Router();
        const blancoBiologicoService = new BlancoBiologicoService();
        const controller = new BlancoBiologicoController(
            blancoBiologicoService
        );

        // Rutas de blanco biológico
        router.get('/', controller.getBlancosBiologicos);
        router.get('/page', controller.getBlancosBiologicosByPage);
        router.get('/gte-periodo', controller.getBlancosBiologicosByGtePeriodo);
        router.get('/:id', controller.getBlancoBiologicoById);
        router.post('/', controller.createBlancoBiologico);
        router.put('/:id', controller.updateBlancoBiologico);

        return router;
    }
}
