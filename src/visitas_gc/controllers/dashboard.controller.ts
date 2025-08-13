import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { GestionVisitasFilters, CustomError } from '../../domain';

export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    obtenerEstadisticasGestionVisitas = async (req: Request, res: Response) => {
        try {
            // Extraer los filtros del query
            const {
                idColaborador,
                idMacrozona,
                idEmpresa,
                year,
                month,
                idLabor,
                idSubLabor,
            } = req.query;

            // Construir objeto de filtros
            const filters: GestionVisitasFilters = {
                idColaborador: idColaborador ? +idColaborador : undefined,
                idMacrozona: idMacrozona ? +idMacrozona : undefined,
                idEmpresa: idEmpresa ? +idEmpresa : undefined,
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idLabor: idLabor ? +idLabor : undefined,
                idSubLabor: idSubLabor ? +idSubLabor : undefined,
            };

            const estadisticas =
                await this.dashboardService.obtenerEstadisticasGestionVisitas(
                    filters
                );

            // Responder con las estadísticas (puede ser un objeto vacío si no hay datos)
            return res.status(200).json({
                success: true,
                message:
                    estadisticas.resumen.totalVisitas === 0
                        ? 'No se encontraron visitas con los filtros aplicados'
                        : 'Estadísticas obtenidas exitosamente',
                data: estadisticas,
                filtros: filters,
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}
