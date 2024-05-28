import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ContactoPuntoController } from "./controller";


export class ContactoPuntoRoutes {
    static get routes(): Router{
        const router = Router();
        //const colaboradorService = new ColaboradorService();
        const controller = new ContactoPuntoController();


        router.get('/',controller.getContactosPunto);
        router.post('/',[ AuthMiddleware.validateJWT] ,controller.createContactoPunto);

        return router;
    }
}