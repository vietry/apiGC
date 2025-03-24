import { Router } from 'express';
import { GteController } from './controller';
import { GteService } from '../../services/gte.service';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

export class GteRoutes {
    static get routes(): Router {
        const router = Router();
        const gteService = new GteService();
        const controller = new GteController(gteService);

        router.get('/', controller.getGtes);
        router.get('/all', controller.getAllGtes);
        router.get('/:id', controller.getGteById);
        router.get(
            '/colaborador/:idColaborador',
            controller.getGteByColaboradorId
        );
        router.get('/usuario/:idUsuario', controller.getGteByUsuarioId);
        router.post('/', [AuthMiddleware.validateJWT], controller.createGte);
        router.post(
            '/admin',
            [AuthMiddleware.validateJWT],
            controller.createGteAdmin
        );
        router.put(
            '/:id',
            /*[AuthMiddleware.validateJWT],*/ controller.updateGte
        );

        return router;
    }
}
