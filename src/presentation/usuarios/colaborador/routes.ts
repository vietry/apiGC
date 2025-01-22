import { Router } from "express";
import { ColaboradorController } from "./controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { ColaboradorService } from "../../services/colaborador.service";

export class ColaboradorRoutes {
  static get routes(): Router {
    const router = Router();
    const colaboradorService = new ColaboradorService();
    const controller = new ColaboradorController(colaboradorService);

    router.get("/", controller.getColaboradores);
    router.get("/all", controller.getAllColaboradores);
    router.get("/:id", controller.getColaboradorById);
    router.post("/", controller.createColaborador);
    router.put("/:id", controller.updateColaborador);

    return router;
  }
}
