import { Router } from "express";
import { CultivoController } from "./controller";
import { CultivoService } from "../services/cultivo.service";

export class CultivoRoutes {
    static get routes(): Router {
        const router = Router();
        const cultivoService = new CultivoService();
        const controller = new CultivoController(cultivoService);

        // Rutas de cultivo
        router.get('/', controller.getCultivos);
        router.get('/:id', controller.getCultivoById);
        //router.post('/', controller.createCultivo);
        //router.put('/:id', controller.updateCultivo);

        return router;
    }
}