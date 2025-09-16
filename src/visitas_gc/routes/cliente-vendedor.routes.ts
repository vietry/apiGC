import { Router } from 'express';
import { ClienteVendedorController } from '../controllers/cliente-vendedor.controller';
import { ClienteVendedorService } from '../services/cliente-vendedor.service';

export class ClienteVendedorRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ClienteVendedorController(
            new ClienteVendedorService()
        );

        // Exactus (solo GET)
        router.get('/exactus', controller.getExactusAll);
        router.get('/exactus/:id', controller.getExactusById);

        // GC
        router.get('/gc', controller.getGCAll);
        router.get('/gc/:id', controller.getGCById);
        router.post('/gc', controller.createGC);
        router.put('/gc/:id', controller.updateGC);

        // Combinado
        router.get('/combined', controller.getCombined);

        return router;
    }
}
