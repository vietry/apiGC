// import { Router } from 'express';
// import { PlanificacionController } from '../controllers/planificacion.controller';
// import { PlanificacionService } from '../services/planificacion.service';

// export class PlanificacionRoutes {
//     static get routes(): Router {
//         const router = Router();

//         const planificacionService = new PlanificacionService();
//         const controller = new PlanificacionController(planificacionService);

//         // Rutas principales
//         router.get('/', controller.getAllPlanificaciones);
//         router.get('/:id', controller.getPlanificacionById);
//         router.post('/', controller.createPlanificacion);
//         router.put('/:id', controller.updatePlanificacion);
//         router.delete('/:id', controller.deletePlanificacion);

//         // Rutas de activación/desactivación
//         router.patch('/:id/deactivate', controller.deactivatePlanificacion);
//         router.patch('/:id/activate', controller.activatePlanificacion);

//         // Rutas de aprobación
//         router.patch('/:id/approve', controller.approvePlanificacion);
//         router.patch('/:id/reject', controller.rejectPlanificacion);

//         // Rutas auxiliares
//         router.get('/momentos/aplicacion', controller.getMomentosAplicacion);
//         router.get(
//             '/colaborador/:idColaborador',
//             controller.getPlanificacionesByColaborador
//         );

//         return router;
//     }
// }
