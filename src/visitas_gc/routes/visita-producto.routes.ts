import { Router } from 'express';
import { VisitaProductoController } from '../controllers/visita-producto.controller';
import { VisitaProductoService } from '../services/visita-producto.service';

export class VisitaProductoRoutes {
    static get routes(): Router {
        const router = Router();
        const service = new VisitaProductoService();
        const controller = new VisitaProductoController(service);

        // Endpoint para crear una nueva VisitaProducto
        router.post('/', controller.createVisitaProducto);
        // Endpoint para actualizar una VisitaProducto
        router.put('/:id', controller.updateVisitaProducto);
        // Endpoint para obtener una VisitaProducto por id
        router.get('/:id', controller.getVisitaProductoById);
        // Endpoint para obtener las VisitaProductos de una Visita
        router.get(
            '/visita/:idVisita',
            controller.getVisitaProductosByVisitaId
        );

        return router;
    }
}
