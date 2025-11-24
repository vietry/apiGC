import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { SyncService, type SyncAction } from '../services/sync.service';

export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    /**
     * Endpoint para sincronización batch
     */
    syncBatch = async (req: Request, res: Response) => {
        const { actions } = req.body as { actions: SyncAction[] };

        if (!Array.isArray(actions) || actions.length === 0) {
            return res.status(400).json({
                error: 'Se requiere un array de acciones no vacío',
            });
        }

        try {
            const results = await this.syncService.processBatchSync(actions);

            return res.status(200).json({
                success: true,
                results,
                totalActions: actions.length,
                successCount: results.filter((r) => r.status === 'success')
                    .length,
                errorCount: results.filter((r) => r.status === 'error').length,
                conflictCount: results.filter((r) => r.status === 'conflict')
                    .length,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Endpoint para obtener datos de referencia
     */
    getReferenceData = async (req: Request, res: Response) => {
        const { idColaborador } = req.query;

        try {
            const data = await this.syncService.getReferenceData(
                idColaborador ? Number(idColaborador) : undefined
            );

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
