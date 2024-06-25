import { Router } from "express";
import { FotoDemoplotService } from "../services/foto-demoplot.service";
import { FotoDemoplotController } from "./controller";


export class FotoDemoplotRoutes {
    static get routes(): Router{
        const router = Router();
        const fotoDemoplotService = new FotoDemoplotService();
        const controller = new FotoDemoplotController(fotoDemoplotService);

        // api/fotodemoplots/single
        //router.post('/single', controller.createFotoDemoplot);

        // api/fotodemoplots
        router.get('/', controller.getFotosDemoplots);
        router.get('/:idDemoPlot', controller.getFotosByIdDemoplot);

        return router;
    }
}