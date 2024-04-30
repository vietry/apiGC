import { Router } from "express";
import { TodosController } from "./todos/controller";
import { TodoRoutes } from "./todos/routes";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
    static get routes(): Router{
        const router = Router();


        router.use('/api/todos', TodoRoutes.routes);
        router.use('/api/auth', AuthRoutes.routes);
        // router.use('/api/products', TodoRoutes.routes);
        // router.use('/api/clients', TodoRoutes.routes);
        // router.use('/api/users', TodoRoutes.routes);


        return router;
    }
}