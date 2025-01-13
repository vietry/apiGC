import { Router } from "express";
import { VegetacionController } from "./controller";
import { VegetacionService } from "../services/vegetacion.service";

export class VegetacionRoutes {
  static get routes(): Router {
    const router = Router();
    const vegetacionService = new VegetacionService();
    const controller = new VegetacionController(vegetacionService);

    // Rutas de vegetación
    router.get("/", controller.getVegetacion);
    router.get("/gc", controller.getVegetacionGC);
    router.get("/pagination", controller.getVegetacionPagination);
    router.get("/:id", controller.getVegetacionById);
    router.post("/", controller.createVegetacion);
    router.put("/:id", controller.updateVegetacion);

    return router;
  }
}
