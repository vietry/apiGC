import { Router } from "express";
import { AsistenciaController } from "./controller";
import { AsistenciaService } from "../services/charla/asistencia.service";

export class AsistenciaRoutes {
    static get routes(): Router {
        const router = Router();
        const asistenciaService = new AsistenciaService();
        const controller = new AsistenciaController(asistenciaService);

        router.get('/', controller.getAsistencias);
        router.get('/:id', controller.getAsistenciaById);
        router.get('/charla/:idCharla', controller.getAsistenciasByIdCharla); // Nueva ruta
        router.get('/usuario/:idUsuario', controller.getAsistenciasByUsuario);
        router.post('/', controller.createAsistencia);
        router.put('/:id', controller.updateAsistencia);
        router.delete('/:id', controller.deleteAsistencia);
        return router;
    }
}