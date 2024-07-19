import { Router } from 'express';
import { ProvinciaController } from './controller';
import { ProvinciaService } from '../services';



export class ProvinciaRoutes {
    static get routes(): Router {
        const router = Router();
        const provinciaService = new ProvinciaService();
        const controller = new ProvinciaController(provinciaService);

        // Rutas de provincia
        router.get('/', controller.getProvincias);
        router.get('/:id', controller.getProvinciaById);

        return router;
    }
}