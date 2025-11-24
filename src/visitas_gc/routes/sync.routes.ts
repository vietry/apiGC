import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { SyncService } from '../services/sync.service';

export class SyncRoutes {
    static get routes(): Router {
        const router = Router();
        const syncService = new SyncService();
        const controller = new SyncController(syncService);

        // Sincronización batch
        router.post('/batch', controller.syncBatch);

        // Datos de referencia para offline
        router.get('/reference-data', controller.getReferenceData);

        return router;
    }
}
