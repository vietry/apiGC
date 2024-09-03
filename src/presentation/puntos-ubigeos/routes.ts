import { Router } from "express";
import { PuntoUbigeoController } from "./controller";
import { PuntoUbigeoService } from "../services";

export class PuntoUbigeoRoutes {
    static get routes(): Router {
        const router = Router();
        const puntoUbigeoService = new PuntoUbigeoService();
        const controller = new PuntoUbigeoController(puntoUbigeoService);

        router.get('/puntos/:idPunto', controller.getPuntosUbigeoByPuntoId);
        router.get('/punto/:idPuntoContacto', controller.getPuntoUbigeoByPuntoId);
        router.get('/:id', controller.getPuntoUbigeoById);
        router.get('/', controller.getPuntosUbigeo);
        router.post('/', controller.createPuntoUbigeo);
        router.put('/:id', controller.updatePuntoUbigeo);

        return router;
    }
}
