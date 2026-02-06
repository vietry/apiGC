import { Router } from 'express';
import { LoginAuditController } from './controller';
import { LoginAuditService } from '../services/login-audit.service';

export class LoginAuditRoutes {
    static get routes(): Router {
        const router = Router();
        const loginAuditService = new LoginAuditService();
        const controller = new LoginAuditController(loginAuditService);

        // Rutas de estadísticas (deben ir antes de las rutas con parámetros)
        router.get('/stats/app-version', controller.getStatsByAppVersion);
        router.get('/stats/platform', controller.getStatsByPlatform);
        router.get('/stats/failed', controller.getFailedLoginStats);

        // Ruta para obtener historial por usuario
        router.get('/usuario/:usuarioId', controller.getLoginAuditsByUsuario);

        // CRUD básico
        router.get('/', controller.getLoginAudits);
        router.get('/:id', controller.getLoginAuditById);
        router.post('/', controller.createLoginAudit);

        return router;
    }
}
