import { Router } from "express";
import { ArticuloController } from "./controller";
import { ArticuloService } from "../services/articulo.service";

export class ArticuloRoutes {
    static get routes(): Router {
        const router = Router();
        const articuloService = new ArticuloService();
        const controller = new ArticuloController(articuloService);

        // Rutas de articulo
        router.get('/', controller.getArticulos);
        router.get('/enfoque', controller.getArticulosConEnfoque);
        router.get('/page', controller.getArticulosByPage);
        
        router.get('/:id', controller.getArticuloById);
        
        //router.post('/', controller.createArticulo);
        //router.put('/:id', controller.updateArticulo);

        return router;
    }
}