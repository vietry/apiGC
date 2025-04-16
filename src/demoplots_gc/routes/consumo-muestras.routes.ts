import { Router } from 'express';
import { ConsumoMuestrasController } from '../controllers/consumo-muestras.controller';
import { ConsumoMuestrasService } from '../services/consumo-muestras.service';

export class ConsumoMuestrasRoutes {
    static get routes(): Router {
        const router = Router();
        const consumoMuestrasService = new ConsumoMuestrasService();
        const controller = new ConsumoMuestrasController(
            consumoMuestrasService
        );

        router.get('/', controller.getConsumoMuestras);
        router.get('/all', controller.getAllConsumoMuestras);
        router.get('/total', controller.getConsumoTotal);
        router.get('/stats', controller.getStatisticsConsolidated);
        router.get('/:id', controller.getConsumoMuestrasById);
        router.post('/', controller.createConsumoMuestras);
        router.put('/:id', controller.updateConsumoMuestras);

        return router;
    }
}
