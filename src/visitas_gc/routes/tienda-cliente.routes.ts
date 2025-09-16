import { Router } from 'express';
import { TiendaClienteController } from '../controllers/tienda-cliente.controller';
import { TiendaClienteService } from '../services/tienda-cliente.service';

export class TiendaClienteRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new TiendaClienteController(
            new TiendaClienteService()
        );

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);

        return router;
    }
}
