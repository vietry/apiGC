import { Router } from "express";
import { ColaboradorController } from "./controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export class ColaboradorRoutes {
    static get routes(): Router{
        const router = Router();
        const controller = new ColaboradorController();


        router.get('/',controller.getColaboradores);
        router.post('/',[ AuthMiddleware.validateJWT] ,controller.createColaborador);




        return router;
    }
}