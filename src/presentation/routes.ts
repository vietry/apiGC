import { Router } from "express";
import { TodoRoutes } from "./todos/routes";
import { AuthRoutes } from "./auth/routes";
import { ColaboradorRoutes } from "./usuarios/colaborador/routes";
import { GteRoutes } from "./usuarios/gte/routes";
import { PuntoContactoRoutes } from "./puntos-contacto/routes";
import { ContactoPuntoRoutes } from "./contactos-punto/routes";
import { DemoplotRoutes } from "./demoplots/routes";
import { FileUploadRoutes } from "./file-upload/routes";
import { ImageRoutes } from "./images/routes";
import { FotoDemoplotRoutes } from "./fotos-demoplot/routes";

export class AppRoutes {
    static get routes(): Router{
        const router = Router();

        router.use('/api/todos', TodoRoutes.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/colaboradores', ColaboradorRoutes.routes);
        router.use('/api/gtes', GteRoutes.routes);
        router.use('/api/puntoscontacto', PuntoContactoRoutes.routes);
        router.use('/api/contactospunto', ContactoPuntoRoutes.routes);
        router.use('/api/demoplots', DemoplotRoutes.routes);
        router.use('/api/upload', FileUploadRoutes.routes);
        router.use('/api/images', ImageRoutes.routes);
        router.use('/api/fotosdemoplots', FotoDemoplotRoutes.routes);

        return router;
    }
}