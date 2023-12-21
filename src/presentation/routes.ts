import { Router } from "express";




export class AppRoutes {
    static get routes(): Router{
        const router = Router();

        router.get('/api/todos', (req, res) =>{
            res.json([
                {id: 1, title: "Buy groceries", done: false, date: new Date()},
                {id: 2, title: "Take out the trash", done: true, date: new Date()},

            ])
        })


        return router;
    }
}