import { Router } from 'express';
import { UbicacionClienteController } from '../controllers/ubicacion-cliente.controller';

export class UbicacionClienteRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UbicacionClienteController();

        // Rutas específicas PRIMERO (para evitar conflictos con /:id)
        router.get('/stats/resumen', controller.getEstadisticas);
        router.get('/cliente/:clienteCode', controller.getByCliente);
        router.get('/esquema/:esquema', controller.getByEsquema);
        router.get('/search/:term', controller.search);

        // Rutas principales CRUD (/:id debe ir al final)
        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);
        router.delete('/:id', controller.delete);

        return router;
    }
}
