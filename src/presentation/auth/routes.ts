import { Router } from "express";


export class AuthRoutes{

    static get routes(): Router {
        const router = Router();
    

        router.use('/login', )
        router.use('/register', )

        router.use('/validate-email/:token', )


    return router;
    }


}