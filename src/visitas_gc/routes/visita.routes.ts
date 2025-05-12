import { Router } from 'express';
import { VisitaController } from '../controllers/visita.controller';
import { VisitaService } from '../services/visita.service';

export class VisitaRoutes {
    static get routes(): Router {
        const router = Router();
        const visitaService = new VisitaService();
        const controller = new VisitaController(visitaService);

        router.get('/', controller.getVisitas);
        router.get('/all', controller.getAllVisitas);
        router.get('/estadisticas', controller.getVisitasEstadisticas);
        router.get('/ranking-clientes', controller.getPuntoContactoRanking); // NUEVA RUTA para ranking
        router.get('/:id', controller.getVisitaById);
        router.post('/', controller.createVisita);
        router.post('/bulk', controller.createMultipleVisitas);
        router.put('/:id', controller.updateVisita);

        return router;
    }
}
