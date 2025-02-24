import { Router } from 'express';
import { ExternoController } from './controller';
import { ExternoService } from '../services/externo.service';

export class ExternoRoutes {
    static get routes(): Router {
        const router = Router();
        const externoService = new ExternoService();
        const controller = new ExternoController(externoService);

        router.get('/', controller.getExternos);
        router.get('/all', controller.getAllExternos);
        router.get('/:id', controller.getExternoById);
        router.post('/', controller.createExterno);
        router.put('/:id', controller.updateExterno);

        return router;
    }
}
