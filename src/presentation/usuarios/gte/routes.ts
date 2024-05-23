import { Router } from "express";
import { GteController } from "./controller";

export class GteRoutes {
    static get routes(): Router{
        const router = Router();
        const controller = new GteController();


        router.get('/',controller.getGtes);
        router.post('/',controller.registerGte);

        // router.use('/api/products', TodoRoutes.routes);
        // router.use('/api/clients', TodoRoutes.routes);
        // router.use('/api/users', TodoRoutes.routes);


        return router;
    }
}
