import { Router } from "express";
import { UsuariosController } from "./controller";
import { UsuariosService } from "../services";

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();

    // Instanciar el servicio y el controlador
    const usuariosService = new UsuariosService();
    const controller = new UsuariosController(usuariosService);

    // Rutas principales de Usuarios

    router.get("/", controller.getAllUsuarios);
    router.get("/all", controller.getUsuariosByPage);
    router.get("/:id", controller.getUsuarioById);
    router.post("/", controller.createUsuario);
    router.put("/:id", controller.updateUsuario);
    //router.delete("/:id", [AuthMiddleware] ,controller.deleteUsuario);

    return router;
  }
}
