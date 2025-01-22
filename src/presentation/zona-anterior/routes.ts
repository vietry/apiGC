import { Router } from "express";
import { ZonaAnteriorController } from "./controller";
import { ZonaAnteriorService } from "../services/zona-anterior.service";

export class ZonaAnteriorRoutes {
  static get routes(): Router {
    const router = Router();
    const zonaAnteriorService = new ZonaAnteriorService();
    const controller = new ZonaAnteriorController(zonaAnteriorService);

    // Rutas para ZonaAnterior
    // Listar todas sin paginación
    router.get("/", controller.getAllZonasAnteriores);
    // Listado paginado
    router.get("/page", controller.getZonaAnterioresByPage);
    // Obtener ZonaAnterior por ID
    router.get("/:id", controller.getZonaAnteriorById);
    // Crear ZonaAnterior
    router.post("/", controller.createZonaAnterior);
    // Actualizar ZonaAnterior
    router.put("/:id", controller.updateZonaAnterior);

    return router;
  }
}
