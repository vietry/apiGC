import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { AsesorDashboardService, AsesorDashboardFilters } from '../services';

export class AsesorDashboardController {
    constructor(
        private readonly asesorDashboardService: AsesorDashboardService
    ) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    /**
     * Extrae los filtros comunes del query string.
     */
    private extractFilters(query: any): AsesorDashboardFilters {
        return {
            idVegetacion: query.idVegetacion ? +query.idVegetacion : undefined,
            vegetacion: query.vegetacion?.toString(),
            idVariedad: query.idVariedad ? +query.idVariedad : undefined,
            idPuntoContacto: query.idPuntoContacto
                ? +query.idPuntoContacto
                : undefined,
            idContactoPunto: query.idContactoPunto
                ? +query.idContactoPunto
                : undefined,
            codCliente: query.codCliente?.toString(),
            idColaborador: query.idColaborador
                ? +query.idColaborador
                : undefined,
            idGte: query.idGte ? +query.idGte : undefined,
            idEmpresa: query.idEmpresa ? +query.idEmpresa : undefined,
            negocio: query.negocio?.toString(),
            departamento: query.departamento?.toString(),
            provincia: query.provincia?.toString(),
            distrito: query.distrito?.toString(),
            nomAsesor: query.nomAsesor?.toString(),
            cargoAsesor: query.cargoAsesor?.toString(),
        };
    }

    /**
     * GET /api/dashboards/asesores
     * Lista paginada de cultivos con info completa de asesores.
     */
    getAsesoresList = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const filters = this.extractFilters(req.query);

            this.asesorDashboardService
                .getAsesoresList(paginationDto!, filters)
                .then((result) => res.status(200).json(result))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * GET /api/dashboards/asesores/stats
     * Estadísticas agrupadas para gráficas.
     */
    getAsesoresStats = async (req: Request, res: Response) => {
        try {
            const filters = this.extractFilters(req.query);

            this.asesorDashboardService
                .getAsesoresStats(filters)
                .then((stats) => res.status(200).json(stats))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * GET /api/dashboards/asesores/map
     * Datos agrupados por ubicación geográfica para mapa.
     */
    getAsesoresMap = async (req: Request, res: Response) => {
        try {
            const filters = this.extractFilters(req.query);

            this.asesorDashboardService
                .getAsesoresMap(filters)
                .then((mapData) => res.status(200).json(mapData))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * GET /api/dashboards/asesores/export
     * Exporta a Excel (.xlsx) la lista de asesores con resumen estadístico.
     * Acepta los mismos filtros que los demás endpoints.
     */
    exportAsesoresExcel = async (req: Request, res: Response) => {
        try {
            const filters = this.extractFilters(req.query);

            const buffer =
                await this.asesorDashboardService.exportAsesoresExcel(filters);

            const timestamp = new Date()
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, '');

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=asesores_dashboard_${timestamp}.xlsx`
            );
            res.send(buffer);
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
