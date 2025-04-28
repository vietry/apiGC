import { Router } from 'express';
import { CultivoController } from './controller';
import { CultivoService } from '../services/cultivo.service';

export class CultivoRoutes {
    static get routes(): Router {
        const router = Router();
        const cultivoService = new CultivoService();
        const controller = new CultivoController(cultivoService);

        // Rutas de cultivo
        //! TODO ACTUALIZAR EN LA APP NUEVA RUTA PARA PAGINACION Y ALL CULTIVOS
        router.get('/', controller.getCultivos);
        router.get('/all', controller.getAllCultivos);
        router.get('/:id', controller.getCultivoById);
        router.get(
            '/contacto/:idContactoPunto',
            controller.getCultivosByContactoPuntoId
        );
        router.get(
            '/punto/:idPuntoContacto',
            controller.getCultivosByPuntoContactoId
        );
        router.post('/', controller.createCultivo);
        router.put('/:id', controller.updateCultivo);

        return router;
    }
}
