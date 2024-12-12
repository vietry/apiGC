import { Router } from "express";
import { CharlaProductoController } from "./controller";
import { CharlaProductoService } from "../services";


export class CharlaProductoRoutes {
    static get routes(): Router {
        const router = Router();
        const charlaProductoService = new CharlaProductoService();
        const controller = new CharlaProductoController(charlaProductoService);

        router.get('/', controller.getCharlaProductos);
        router.get('/:id', controller.getCharlaProductoById);
        router.get('/charla/:idCharla', controller.getCharlaProductosByIdCharla);
        router.post('/', controller.createCharlaProducto);
        router.put('/:id', controller.updateCharlaProducto);
        router.delete('/:id', controller.deleteCharlaProductoById);

        return router;
    }
}