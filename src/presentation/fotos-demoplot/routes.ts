import { Router } from "express";
import { FotoDemoplotService } from "../services/foto-demoplot.service";
import { FotoDemoplotController } from "./controller";


export class FotoDemoplotRoutes {
    static get routes(): Router{
        const router = Router();
        const fotoDemoplotService = new FotoDemoplotService();
        const controller = new FotoDemoplotController(fotoDemoplotService);

        // api/fotodemoplots
        router.get('/', controller.getFotosDemoplots);
        router.get('/:id', controller.getFotoDemoplotById);
        router.get('/demoplot/:idDemoPlot', controller.getFotosByIdDemoplot);
        router.delete('/:id', controller.deleteFotoDemoplotById);

        return router;
    }
}