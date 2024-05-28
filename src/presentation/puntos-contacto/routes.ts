import { Router } from "express";
import { PuntoContactoController } from "./controller";
import { PuntoContactoService } from "../services";


export class PuntoContactoRoutes {
    static get routes(): Router {
        const router = Router();
        const puntoContactoService = new PuntoContactoService();
        const controller = new PuntoContactoController(puntoContactoService);

        router.get('/',controller.getPuntosContacto);
        router.post('/',controller.createPuntoContacto);

        return router;
    }
}
