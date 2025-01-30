import { Router } from 'express';
import { VariablePersonalController } from './controller';
import { VariablePersonalService } from '../services';

export class VariablePersonalRoutes {
    static get routes(): Router {
        const router = Router();
        const variablePersonalService = new VariablePersonalService();
        const controller = new VariablePersonalController(
            variablePersonalService
        );

        router.get('/', controller.getVariablesPersonales);
        router.get('/all', controller.getAllVariablesPersonales);
        router.get('/:id', controller.getVariablePersonalById);
        router.post('/', controller.createVariablePersonal);
        router.put('/:id', controller.updateVariablePersonal);
        router.post('/generate', controller.generateVariablePersonal);

        return router;
    }
}
