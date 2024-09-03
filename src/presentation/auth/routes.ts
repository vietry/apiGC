import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";



export class AuthRoutes{

    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL,
        );
        const authService = new AuthService(emailService);
    
        const controller = new AuthController(authService);

        router.use('/login', controller.loginUsuario)
        router.use('/register', controller.registerUsuario)
        router.post('/register-multiple', controller.registerMultipleUsuarios)
        router.use('/check-status', [ AuthMiddleware.validateAndReturnUser])
        router.use('/validate-email/:token', controller.validateEmail)


    return router;
    }


}