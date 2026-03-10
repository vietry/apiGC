import { Router } from 'express';
import { AppUpdateController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AppUpdateRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new AppUpdateController();

        // Verificar actualización — la app Flutter llama esto al iniciar
        router.get(
            '/check',
            [AuthMiddleware.validateJWT],
            controller.checkUpdate
        );

        // Descargar APK — protegido para que solo usuarios autenticados descarguen
        router.get(
            '/download-apk',
            [AuthMiddleware.validateJWT],
            controller.downloadApk
        );

        // Info de versión — para panel admin (protegido)
        router.get(
            '/version-info',
            [AuthMiddleware.validateJWT],
            controller.getVersionInfo
        );

        return router;
    }
}
