import { Router } from 'express';
import { VideoController } from './controller';

export class VideoRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new VideoController();

        // Ruta específica para videos de demoplots
        // Ejemplo: /v1/api/videos/demoplots/123/abc123.mp4
        router.get(
            '/demoplots/:idDemoplot/:video',
            controller.getVideoDemoplot
        );

        // Ruta genérica para otros tipos de videos
        // Ejemplo: /v1/api/videos/charlas/456/video.mp4
        router.get('/:type/:folder/:video', controller.getVideo);

        return router;
    }
}
