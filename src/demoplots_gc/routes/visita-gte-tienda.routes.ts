import { Router } from 'express';
import { VisitaGteTiendaController } from '../controllers/visita-gte-tienda.controller';
import { VisitaGteTiendaService } from '../services/visita-gte-tienda.service';

export class VisitaGteTiendaRoutes {
    static get routes(): Router {
        const router = Router();
        const visitaGteTiendaService = new VisitaGteTiendaService();
        const controller = new VisitaGteTiendaController(
            visitaGteTiendaService
        );

        router.get('/', controller.getVisitaGteTiendas);
        router.get('/:id', controller.getVisitaGteTiendaById);
        router.post('/', controller.createVisitaGteTienda);
        router.put('/:id', controller.updateVisitaGteTienda);
        return router;
    }
}
