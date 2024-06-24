import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middelware";
import { TypeMiddleware } from "../middlewares/type.middleware";
import { FotoDemoplotService } from "../services/foto-demoplot.service";


export class FileUploadRoutes {
    static get routes(): Router{
        const router = Router();
        
        const controller = new FileUploadController(
            new FileUploadService(),
            new FotoDemoplotService()
        );

        router.use(FileUploadMiddleware.containFiles);
        router.use(TypeMiddleware.validTypes(['usuarios', 'demoplots', 'variedad']));

        // api/upload/single/<user|category|product>/
        // api/upload/multiple/<user|category|product>/
        router.post('/single/:type',controller.uploadFile);
        router.post('/multiple/:type',controller.uploadMultipleFiles);
        router.post('/foto/:type', controller.uploadAndCreateFotoDemoPlot);
        return router;
    }
}