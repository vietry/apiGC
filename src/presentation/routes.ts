import { Router } from "express";
import { TodoRoutes } from "./todos/routes";
import { AuthRoutes } from "./auth/routes";
import { ColaboradorRoutes } from "./usuarios/colaborador/routes";
import { GteRoutes } from "./usuarios/gte/routes";

export class AppRoutes {
    static get routes(): Router{
        const router = Router();


        router.use('/api/todos', TodoRoutes.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/colaboradores', ColaboradorRoutes.routes);
        router.use('/api/gtes', GteRoutes.routes);



        return router;
    }
}