import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middelware';
import { TypeMiddleware } from '../middlewares/type.middleware';

export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new FileUploadController(new FileUploadService());
        router.use(
            TypeMiddleware.validTypes([
                'usuarios',
                'demoplots',
                'variedad',
                'charlas',
                'videos',
            ])
        );

        router.delete('/delete/:type/:img', controller.deleteFile);
        router.delete(
            '/delete/videos/:idDemoplot/:videoName',
            controller.deleteVideoDemoplot
        );

        router.use(FileUploadMiddleware.containFiles);

        // api/upload/single/<user|category|product>/
        // api/upload/multiple/<user|category|product>/
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);
        router.post('/foto/charlas', controller.uploadAndCreateFotoCharla);
        router.post('/foto/usuarios', controller.uploadAndCreateFotoUsuario);

        // Batch: 3 fotos obligatorias para estado "Completado"
        router.post(
            '/foto/demoplots/batch-completado',
            controller.uploadBatchFotosDemoPlotCompletado
        );

        // Videos demoplot
        router.post(
            '/video/demoplots',
            controller.uploadAndCreateVideoDemoplot
        );
        router.put(
            '/video/demoplots/:id',
            controller.uploadAndUpdateVideoDemoplot
        );

        router.post('/foto/:type', controller.uploadAndCreateFotoDemoPlot);
        router.put('/foto/:type/:id', controller.uploadAndCreateFotoDemoPlot);
        router.put('/foto/charlas/:id', controller.uploadAndUpdateFotoDemoPlot);

        router.delete('/delete/:type/:img', controller.deleteFileDemoplot);
        router.delete(
            '/delete/:type/:idCharla/:img',
            controller.deleteFileCharla
        );
        router.delete(
            '/delete/:type/:idUsuario/:img',
            controller.deleteFotoUsuario
        );

        return router;
    }
}
