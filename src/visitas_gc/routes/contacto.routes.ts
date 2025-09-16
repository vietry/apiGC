import { Router } from 'express';
import { ContactoController } from '../controllers/contacto.controller';
import { ContactoService } from '../services/contacto.service';

export class ContactoRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ContactoController(new ContactoService());

        router.get('/', controller.getAll);
        router.get('/:id', controller.getById);
        router.post('/', controller.create);
        router.put('/:id', controller.update);

        return router;
    }
}
