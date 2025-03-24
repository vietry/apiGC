import { Router } from 'express';
import { EntregaMuestrasController } from '../controllers/entrega-muestras.controller';
import { EntregaMuestrasService } from '../services/entrega-muestras.service';

export class EntregaMuestrasRoutes {
    static get routes(): Router {
        const router = Router();
        const entregaMuestrasService = new EntregaMuestrasService();
        const controller = new EntregaMuestrasController(
            entregaMuestrasService
        );

        router.get('/', controller.getEntregaMuestras);
        router.get('/all', controller.getAllEntregaMuestras);
        router.get('/:id', controller.getEntregaMuestrasById);
        router.post('/', controller.createEntregaMuestras);
        router.put('/:id', controller.updateEntregaMuestras);

        return router;
    }
}
