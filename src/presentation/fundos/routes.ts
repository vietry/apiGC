import { Router } from 'express';
import { FundoController } from './controller';
import { FundoService } from '../services';

export class FundoRoutes {
    static get routes(): Router {
        const router = Router();
        const fundoService = new FundoService();
        const controller = new FundoController(fundoService);

        router.get('/', controller.getFundos);
        router.get('/all', controller.getAllFundos);
        // router.get(
        //     '/punto/:idPuntoContacto',
        //     controller.getFundosByPuntoContactoId
        // );
        router.get(
            '/contacto/:idContactoPunto',
            controller.getFundosByContactoPuntoId
        );
        router.get('/:id', controller.getFundoById);
        router.post('/', controller.createFundo);
        router.put('/:id', controller.updateFundo);

        return router;
    }
}
