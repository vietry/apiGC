import { Router } from 'express';
import { VariedadService } from '../services';
import { VariedadController } from './controller';


export class VariedadRoutes {
    static get routes(): Router {
        const router = Router();
        const variedadService = new VariedadService();
        const controller = new VariedadController(variedadService);

        // Rutas de variedad
        router.get('/', controller.getVariedades);
        router.get('/page/', controller.getVariedadesByPage);
        router.get('/:id', controller.getVariedadById);
        //router.post('/variedades', controller.createVariedad);
        //router.put('/variedades/:id', controller.updateVariedad);

        return router;
    }
}