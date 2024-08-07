import { Router } from "express";
//import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DemoplotController } from "./controller";
import { DemoplotService } from "../services";



export class DemoplotRoutes {
    static get routes(): Router{
        const router = Router();
        const demoplotService = new DemoplotService();
        const controller = new DemoplotController(demoplotService);

        router.get('/',controller.getDemoplots);
        router.get('/:id',controller.getDemoplotById);
        router.get('/gte/:idGte',controller.getDemoplotsByGteId);
        router.get('/count/:idUsuario', controller.countDemoplotsByGte);
        router.post('/',controller.createDemoplot);
        router.put('/:id',controller.updateDemoplot);

        return router;
    }
}