import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { DashboardService } from '../services';

export class DashboardController {
    // DI
    constructor(private readonly dashboardService: DashboardService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        //grabar logs
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    getGteRankings = async (req: Request, res: Response) => {
        try {
            // Extrae los filtros de req.query
            const {
                year,
                month,
                idColaborador,
                macrozona,
                empresa,
                clase,
                idFamilia,
                activo,
                idGte,
            } = req.query;

            // Construye el objeto de filtros
            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                idGte: idGte ? +idGte : undefined,
                macrozona: macrozona ? +macrozona : undefined,
                empresa: empresa?.toString(),
                clase: clase?.toString(),
                idFamilia: idFamilia ? +idFamilia : undefined,
                activo:
                    activo !== undefined
                        ? !!(activo === 'true' || activo === '1')
                        : undefined,
            };

            // Llama al nuevo método en tu servicio que soporta estos filtros
            this.dashboardService
                .getGteRankings(filters)
                .then((rankings) => res.status(200).json(rankings))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    countDemoplotsByFilters = async (req: Request, res: Response) => {
        try {
            const {
                objetivo,
                idGte,
                idVegetacion,
                cultivo,
                estado,
                idFamilia,
                clase,
                infestacion,
                departamento,
                provincia,
                distrito,
                year,
                month,
                venta,
                validacion,
                empresa,
                macrozona,
                idColaborador,
                gdactivo,
            } = req.query;

            const filters = {
                objetivo: objetivo?.toString(),
                idGte: idGte ? +idGte : undefined,
                idVegetacion: idVegetacion ? +idVegetacion : undefined,
                cultivo: cultivo?.toString(),
                estado: estado?.toString(),
                idFamilia: idFamilia ? +idFamilia : undefined,
                clase: clase?.toString(),
                infestacion: infestacion?.toString(),
                departamento: departamento?.toString(),
                provincia: provincia?.toString(),
                distrito: distrito?.toString(),
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                venta:
                    venta !== undefined
                        ? !!(venta === 'true' || venta === '1')
                        : undefined,
                validacion:
                    validacion !== undefined
                        ? !!(validacion === 'true' || validacion === '1')
                        : undefined,
                empresa: empresa?.toString(),
                macrozona: macrozona ? +macrozona : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                gdactivo:
                    gdactivo !== undefined
                        ? !!(gdactivo === 'true' || gdactivo === '1')
                        : undefined,
            };

            this.dashboardService
                .countDemoplotsByFilters(filters)
                .then((counts) => res.status(200).json(counts))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    countDemoplotsByFiltersCustomDate = async (req: Request, res: Response) => {
        try {
            const {
                objetivo,
                idGte,
                idVegetacion,
                cultivo,
                estado,
                idFamilia,
                clase,
                infestacion,
                departamento,
                provincia,
                distrito,
                year,
                month,
                venta,
                validacion,
                empresa,
                macrozona,
                idColaborador,
                gdactivo,
            } = req.query;

            const filters = {
                objetivo: objetivo?.toString(),
                idGte: idGte ? +idGte : undefined,
                idVegetacion: idVegetacion ? +idVegetacion : undefined,
                cultivo: cultivo?.toString(),
                estado: estado?.toString(),
                idFamilia: idFamilia ? +idFamilia : undefined,
                clase: clase?.toString(),
                infestacion: infestacion?.toString(),
                departamento: departamento?.toString(),
                provincia: provincia?.toString(),
                distrito: distrito?.toString(),
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                venta:
                    venta !== undefined
                        ? !!(venta === 'true' || venta === '1')
                        : undefined,
                validacion:
                    validacion !== undefined
                        ? !!(validacion === 'true' || validacion === '1')
                        : undefined,
                empresa: empresa?.toString(),
                macrozona: macrozona ? +macrozona : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                gdactivo:
                    gdactivo !== undefined
                        ? !!(gdactivo === 'true' || gdactivo === '1')
                        : undefined,
            };

            this.dashboardService
                .countDemoplotsByFiltersCustomDate(filters)
                .then((counts) => res.status(200).json(counts))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getGteRankingsVariable = async (req: Request, res: Response) => {
        try {
            // Extrae los filtros de req.query
            const {
                year,
                month,
                idColaborador,
                macrozona,
                empresa,
                clase,
                activo,
            } = req.query;

            // Construye el objeto de filtros
            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                macrozona: macrozona ? +macrozona : undefined,
                empresa: empresa?.toString(),
                clase: clase?.toString(),
                activo:
                    activo !== undefined
                        ? !!(activo === 'true' || activo === '1')
                        : undefined,
            };

            // Llama al nuevo método en tu servicio que soporta estos filtros
            this.dashboardService
                .getGteRankingsCustomDate(filters)
                .then((rankings) => res.status(200).json(rankings))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getJerarquiaRankings = async (req: Request, res: Response) => {
        try {
            const {
                year,
                month,
                idColaborador,
                macrozona,
                empresa,
                activo,
                idGte,
            } = req.query;

            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                idGte: idGte ? +idGte : undefined,
                macrozona: macrozona ? +macrozona : undefined,
                empresa: empresa?.toString(),
                activo:
                    activo !== undefined
                        ? !!(activo === 'true' || activo === '1')
                        : undefined,
            };

            this.dashboardService
                .getJerarquiaRankings(filters)
                .then((jerarquia) => res.status(200).json(jerarquia))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
