import { Router } from "express";
import { FotoCharlaService } from "../services";
import { FotoCharlaController } from "./controller";


export class FotoCharlaRoutes {
    static get routes(): Router{
        const router = Router();
        const fotoCharlaService = new FotoCharlaService();
        const controller = new FotoCharlaController(fotoCharlaService);

        // api/fotodemoplots
        router.get('/', controller.getFotosCharlas);
        router.get('/:id', controller.getFotoCharlaById);
        router.get('/charla/:idCharla', controller.getFotosByIdCharla);
        router.delete('/:id', controller.deleteFotoCharlaById);

        return router;
    }
}