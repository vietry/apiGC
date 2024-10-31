import { Router } from "express";
import { CharlaController } from "./controller";
import { CharlaService } from "../services/charla/charla.service";


export class CharlaRoutes {
    static get routes(): Router {
        const router = Router();
        const charlaService = new CharlaService();
        const controller = new CharlaController(charlaService);

        router.get('/', controller.getCharlas);
        router.get('/:id', controller.getCharlaById);
        router.post('/', controller.createCharla);
        router.put('/:id', controller.updateCharla);

        return router;
    }
}