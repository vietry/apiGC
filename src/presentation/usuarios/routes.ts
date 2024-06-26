import { Router } from "express";
import { UsuariosController } from "./controller";
import { UsuarioDatasourceImpl } from "../../infrastucture/datasource/usuario.datasource.impl";
import { UsuarioRepositoryImpl } from "../../infrastucture/repositories/usuario.repository.impl";


export class UsuarioRoutes {
    static get routes(): Router{
        const router = Router();

        const datasource = new UsuarioDatasourceImpl();
        const usuarioRepository = new UsuarioRepositoryImpl(datasource);
        const usuarioController = new UsuariosController(usuarioRepository);

        router.get('/', usuarioController.getUsuarios);
        router.get('/:id', usuarioController.getUsuarioById);
        router.post('/', usuarioController.createUsuario);
        router.put('/:id', usuarioController.updateUsuario);
        router.delete('/:id', usuarioController.deleteUsuario);


        return router;
    }
}