import { Router } from 'express';
import { VideoDemoplotService } from '../services/video-demoplot.service';
import { VideoDemoplotController } from './controller';

export class VideoDemoplotRoutes {
    static get routes(): Router {
        const router = Router();
        const videoDemoplotService = new VideoDemoplotService();
        const controller = new VideoDemoplotController(videoDemoplotService);

        // api/videodemoplots
        router.get('/', controller.getVideosDemoplot);
        router.get('/:id', controller.getVideoDemoplotById);
        router.get('/demoplot/:idDemoplot', controller.getVideosByIdDemoplot);
        router.delete('/:id', controller.deleteVideoDemoplotById);
        router.delete('/hard/:id', controller.hardDeleteVideoDemoplotById);

        return router;
    }
}
