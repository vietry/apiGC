import { Router } from "express";
import { AuthController } from "./controller";


export class AuthRoutes{

    static get routes(): Router {
        const router = Router();
    
        const controller = new AuthController();

        router.use('/login', controller.loginUsuario)
        router.use('/register', controller.registerUsuario)

        router.use('/validate-email/:token', controller.validateEmail)


    return router;
    }


}