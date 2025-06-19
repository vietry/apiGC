import { Router } from 'express';
import { ImageController } from './controller';
import { FileUploadController } from '../file-upload/controller';
import { FileUploadService } from '../services/file-upload.service';
//import { TypeMiddleware } from "../middlewares/type.middleware";
//import { FileUploadMiddleware } from "../middlewares/file-upload.middelware";

export class ImageRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ImageController();
        const controller1 = new FileUploadController(new FileUploadService());

        //router.use(TypeMiddleware.validTypes(['usuarios', 'demoplots', 'variedad', 'charlas']));

        router.delete('/delete/:type/:img', controller1.deleteFile);
        router.get('/:type/:idCharla/:img', controller.getImageCharla);
        router.get('/:type/by-email/:email/:img', (req, res) =>
            controller.getImageCharlaByEmail(req, res)
        );
        router.get('/:type/:img', controller.getImage);

        router.delete(
            '/delete/:type/:idCharla/:img',
            controller1.deleteFileCharla
        );

        return router;
    }
}
