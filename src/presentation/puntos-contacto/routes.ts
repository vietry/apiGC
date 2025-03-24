import { Router } from 'express';
import { PuntoContactoController } from './controller';
import { PuntoContactoService } from '../services';

export class PuntoContactoRoutes {
    static get routes(): Router {
        const router = Router();
        const puntoContactoService = new PuntoContactoService();
        const controller = new PuntoContactoController(puntoContactoService);

        router.get('/', controller.getPuntosContacto);
        router.get('/all', controller.getAllPuntosContacto);
        router.get('/:id', controller.getPuntoContactoById);
        router.get('/gte/:idGte', controller.getPuntosContactoByGteId);
        router.post('/', controller.createPuntoContacto);
        router.put('/:id', controller.updatePuntoContacto);

        // Nueva ruta para buscar por codZona e idGte
        router.get(
            '/zona/:codZona',
            controller.getPuntosContactoByCodZonaAndGteId
        );

        return router;
    }
}
