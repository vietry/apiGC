import { Router } from 'express';
import { CharlaController } from './controller';
import { CharlaService } from '../services/charla/charla.service';

export class CharlaRoutes {
    static get routes(): Router {
        const router = Router();
        const charlaService = new CharlaService();
        const controller = new CharlaController(charlaService);

        router.get('/', controller.getCharlas);
        router.get('/all', controller.getAllCharlas);
        router.get('/count', controller.countCharlas);
        router.get('/:id', controller.getCharlaById);

        router.get(
            '/count/:anio/:mes/:idUsuario',
            controller.countCharlasByMesAnio
        );
        router.get('/usuario/:idUsuario', controller.getCharlasByUsuarioId);
        router.post('/', controller.createCharla);
        router.put('/:id', controller.updateCharla);

        return router;
    }
}
