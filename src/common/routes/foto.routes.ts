import { Router } from 'express';
import { FotoService } from '../services/foto.service';
import { FotoController } from '../controllers/foto.controller';

export class FotoRoutes {
    static get routes(): Router {
        const router = Router();
        const fotoService = new FotoService();
        const controller = new FotoController(fotoService);

        router.delete('/:id', controller.deleteFotoById);

        return router;
    }
}
