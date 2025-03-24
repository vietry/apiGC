import { Router } from 'express';
import { FileUploadController } from '../../presentation/file-upload/controller';
import { FileUploadMiddleware } from '../../presentation/middlewares/file-upload.middelware';
import { TypeMiddleware } from '../../presentation/middlewares/type.middleware';
import { FileUploadService } from '../../presentation/services/file-upload.service';

export class FotoUsuarioRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new FileUploadController(new FileUploadService());
        router.use(
            TypeMiddleware.validTypes([
                'usuarios',
                'demoplots',
                'variedad',
                'charlas',
                'visitagtetienda',
            ])
        );
        router.delete(
            '/delete/:type/:idUsuario/:img',
            controller.deleteFotoUsuario
        );
        router.use(FileUploadMiddleware.containFiles);

        router.post('/foto/usuarios', controller.uploadAndCreateFotoUsuario);
        router.post(
            '/foto/visitagtetienda',
            controller.uploadAndCreateFotoVisitaGteTienda
        );
        router.put(
            '/foto/usuarios/:idUsuario',
            controller.uploadAndUpdateFotoUsuario
        );

        return router;
    }
}
