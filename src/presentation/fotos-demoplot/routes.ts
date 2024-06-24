/*import { Router } from "express";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middelware";
import { TypeMiddleware } from "../middlewares/type.middleware";
import { FotoDemoplotService } from "../services/foto-demoplot.service";
import { FotoDemoplotController } from "./controller";


export class FotoDemoplotRoutes {
    static get routes(): Router{
        const router = Router();
        
        const fileUploadService = new FileUploadService();
        const fotoDemoplotService = new FotoDemoplotService(fileUploadService);

        const controller = new FotoDemoplotController(fotoDemoplotService);

        //router.use(FileUploadMiddleware.containFiles);
        //router.use(TypeMiddleware.validTypes(['usuarios', 'demoplots', 'variedad']));

        // api/fotodemoplots/single
        router.post('/single', controller.createFotoDemoplot);

        // api/fotodemoplots
        router.get('/', controller.getFotoDemoplots);

        return router;
    }
}*/