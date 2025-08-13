import { Router } from 'express';
import { NuevaPlanificacionController } from '../controllers/nueva-planificacion.controller';
import { NuevaPlanificacionService } from '../services/nueva-planificacion.service';

export class NuevaPlanificacionRoutes {
    static get routes(): Router {
        const router = Router();
        const service = new NuevaPlanificacionService();
        const controller = new NuevaPlanificacionController(service);

        // Rutas CRUD básicas
        router.get('/', controller.getAllNuevaPlanificaciones);
        router.get('/:id', controller.getNuevaPlanificacionById);
        router.post('/', controller.createNuevaPlanificacion);
        router.put('/:id', controller.updateNuevaPlanificacion);

        // Rutas para activar/desactivar
        router.patch(
            '/:id/deactivate',
            controller.deactivateNuevaPlanificacion
        );
        router.patch('/:id/activate', controller.activateNuevaPlanificacion);

        // Rutas para aprobación y rechazo
        router.patch('/:id/approve', controller.approvePlanificacion);
        router.patch('/:id/reject', controller.rejectPlanificacion);
        router.patch('/:id/estado', controller.changeEstadoPlanificacion);

        return router;
    }
}
