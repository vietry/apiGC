import { Router } from "express";
import { SubZonaController } from "./controller";
import { SubZonaService } from "../services/subzona.service";

export class SubZonaRoutes {
  static get routes(): Router {
    const router = Router();
    const subZonaService = new SubZonaService();
    const controller = new SubZonaController(subZonaService);

    // Rutas para SubZona
    // Listar todas sin paginación
    router.get("/", controller.getAllSubZonas);
    // Listado paginado
    router.get("/page", controller.getSubZonasByPage);
    // Obtener SubZona por ID
    router.get("/:id", controller.getSubZonaById);
    // Crear SubZona
    router.post("/", controller.createSubZona);
    // Actualizar SubZona
    router.put("/:id", controller.updateSubZona);

    return router;
  }
}
