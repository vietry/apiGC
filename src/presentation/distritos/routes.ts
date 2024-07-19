import { Router } from "express";
import { DistritoController } from "./controller";
import { DistritoService } from "../services/distrito.service";

export class DistritoRoutes {
    static get routes(): Router {
        const router = Router();
        const distritoService = new DistritoService();
        const controller = new DistritoController(distritoService);

        // Rutas de distrito
        router.get('/', controller.getDistritos);
        router.get('/:id', controller.getDistritoById);
        //router.post('/', controller.createDistrito);
        //router.put('/:id', controller.updateDistrito);

        return router;
    }
}
