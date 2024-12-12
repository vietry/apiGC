import { Router } from "express";
import { FotoDemoplotService } from "../services/foto-demoplot.service";
import { FotoDemoplotController } from "./controller";
import { FotoDemoPlotLogService } from "../services";
import { FotoDemoPlotLogController } from "../fotos-demoplot-log/controller";


export class FotoDemoplotRoutes {
    static get routes(): Router{
        const router = Router();
        const fotoDemoplotService = new FotoDemoplotService();
        const controller = new FotoDemoplotController(fotoDemoplotService);
        const logService = new FotoDemoPlotLogService();
        const logController = new FotoDemoPlotLogController(logService);

        // api/fotodemoplots
        router.get('/', controller.getFotosDemoplots);
        router.get('/:id', controller.getFotoDemoplotById);
        router.get('/demoplot/:idDemoPlot', controller.getFotosByIdDemoplot);
        router.post('/log/', logController.createFotoDemoPlotLog);
        router.delete('/:id', controller.deleteFotoDemoplotById);

        return router;
    }
}