import { Router } from "express";
import { VariedadService } from "../services";
import { VariedadController } from "./controller";

export class VariedadRoutes {
  static get routes(): Router {
    const router = Router();
    const variedadService = new VariedadService();
    const controller = new VariedadController(variedadService);

    // Rutas de variedad
    router.get("/", controller.getVariedades);
    router.get("/page", controller.getVariedadesByPage);
    router.get("/:id", controller.getVariedadById);
    router.post("/", controller.createVariedad);
    router.put("/:id", controller.updateVariedad);

    return router;
  }
}
