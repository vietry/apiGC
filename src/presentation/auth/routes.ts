import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";


export class AuthRoutes{

    static get routes(): Router {
        const router = Router();
        const authService = new AuthService();
    
        const controller = new AuthController(authService);

        router.use('/login', controller.loginUsuario)
        router.use('/register', controller.registerUsuario)

        router.use('/validate-email/:token', controller.validateEmail)


    return router;
    }


}