import { Router } from 'express';
import { VisitaCultivoAgricultorController } from './controller';
import { VisitaCultivoAgricultorService } from '../services';

export class VisitaCultivoAgricultorRoutes {
    static get routes(): Router {
        const router = Router();
        const visitaCultivoAgricultorService =
            new VisitaCultivoAgricultorService();
        const controller = new VisitaCultivoAgricultorController(
            visitaCultivoAgricultorService
        );

        // Rutas de visita cultivo agricultor
        router.get('/', controller.getVisitasCultivoAgricultor);
        router.get('/:id', controller.getVisitaCultivoAgricultorById);
        router.post('/', controller.createVisitaCultivoAgricultor);
        router.put('/:id', controller.updateVisitaCultivoAgricultor);
        router.delete('/:id', controller.deleteVisitaCultivoAgricultor);

        return router;
    }
}
