import { Router } from 'express';
import { UsuariosController } from './controller';
import { UsuariosService } from '../services';
import { validateSessionMiddleware } from '../middlewares/validate-session.middleware';

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();

        // Instanciar el servicio y el controlador
        const usuariosService = new UsuariosService();
        const controller = new UsuariosController(usuariosService);

        // Middleware de autenticación (opcional, descomentar si se necesita)
        // router.use(validateSessionMiddleware);
        // Rutas principales de Usuarios

        router.get('/', controller.getUsuariosByPage);
        router.get('/all', controller.getAllUsuarios);
        router.get('/by-email/:email', controller.getUsuarioByEmail);
        router.get('/:id', controller.getUsuarioById);
        router.post('/', controller.createUsuario);
        router.put('/:id', controller.updateUsuario);
        //router.delete("/:id", [AuthMiddleware] ,controller.deleteUsuario);

        return router;
    }
}
