import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ContactoPuntoController } from "./controller";
import { ContactoPuntoService } from "../services/contacto-punto.service";


export class ContactoPuntoRoutes {
    static get routes(): Router{
        const router = Router();
        const contactoPuntoService = new ContactoPuntoService();
        const controller = new ContactoPuntoController(contactoPuntoService);


        router.get('/',controller.getContactosPunto);
        router.post('/',controller.createContactoPunto);

        return router;
    }
}