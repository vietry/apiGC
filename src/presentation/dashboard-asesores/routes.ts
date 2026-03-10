import { Router } from 'express';
import { AsesorDashboardService } from '../services';
import { AsesorDashboardController } from './controller';

export class AsesorDashboardRoutes {
    static get routes(): Router {
        const router = Router();
        const service = new AsesorDashboardService();
        const controller = new AsesorDashboardController(service);

        // Lista paginada con filtros
        router.get('/', controller.getAsesoresList);

        // Estadísticas para gráficas
        router.get('/stats', controller.getAsesoresStats);

        // Datos para mapa
        router.get('/map', controller.getAsesoresMap);

        // Exportar a Excel
        router.get('/export', controller.exportAsesoresExcel);

        return router;
    }
}
