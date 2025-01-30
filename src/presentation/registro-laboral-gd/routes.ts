import { Router } from 'express';
import { RegistroLaboralGdController } from './controller';
import { RegistroLaboralGdService } from '../services';

export class RegistroLaboralGdRoutes {
    static get routes(): Router {
        const router = Router();
        const registroLaboralGdService = new RegistroLaboralGdService();
        const controller = new RegistroLaboralGdController(
            registroLaboralGdService
        );

        router.get('/', controller.getRegistrosLaboralesGd);
        router.get('/all', controller.getRegistrosLaboralesGdAll);
        router.get('/:id', controller.getRegistroLaboralGdById);
        router.post('/', controller.createRegistroLaboralGd);
        router.put('/:id', controller.updateRegistroLaboralGd);

        return router;
    }
}
