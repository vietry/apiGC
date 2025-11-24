import { Router } from 'express';
import { CultivoAgricultorController } from './controller';
import { CultivoAgricultorService } from '../services';

export class CultivoAgricultorRoutes {
    static get routes(): Router {
        const router = Router();
        const cultivoAgricultorService = new CultivoAgricultorService();
        const controller = new CultivoAgricultorController(
            cultivoAgricultorService
        );

        // Rutas de cultivo agricultor
        router.get('/', controller.getCultivosAgricultor);
        router.get('/:id', controller.getCultivoAgricultorById);
        router.post('/', controller.createCultivoAgricultor);
        router.put('/:id', controller.updateCultivoAgricultor);
        router.delete('/:id', controller.deleteCultivoAgricultor);

        return router;
    }
}
