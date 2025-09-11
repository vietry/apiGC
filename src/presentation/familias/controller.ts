import { Request, Response } from 'express';

import { CustomError } from '../../domain';
import { FamiliaService } from '../services';

export class FamiliaController {
    constructor(private readonly familiaService: FamiliaService) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res
            .status(500)
            .json({ error: 'Internal server error - check logs' });
    };

    private parseNum(v: unknown): number | undefined {
        return v !== undefined && v !== '' && !Number.isNaN(+v!)
            ? +v!
            : undefined;
    }

    private parseBool(v: unknown): boolean | undefined {
        if (v === undefined) return undefined;
        if (typeof v === 'boolean') return v;
        if (typeof v === 'number') return v === 1;
        if (typeof v === 'string') {
            const s = v.trim().toLowerCase();
            if (s === 'true' || s === '1') return true;
            if (s === 'false' || s === '0') return false;
            return undefined;
        }
        return undefined;
    }

    private parseStr(v: unknown): string | undefined {
        if (typeof v !== 'string') return undefined;
        const t = v.trim();
        return t.length ? t : undefined;
    }

    getResumenMuestras = async (req: Request, res: Response) => {
        try {
            const filters = {
                idGte: this.parseNum(req.query.idGte),
                idFamilia: this.parseNum(req.query.idFamilia),
                idColaborador: this.parseNum(req.query.idColaborador),
                empresa: this.parseStr(req.query.empresa),
                negocio: this.parseStr(req.query.negocio),
                macrozona: this.parseNum(req.query.macrozona),
                activo: this.parseBool(req.query.activo),
                search: this.parseStr(req.query.search),
            } as {
                idGte?: number;
                idFamilia?: number;
                idColaborador?: number;
                empresa?: string;
                negocio?: string;
                macrozona?: number;
                activo?: boolean;
                search?: string;
            };

            const data = await this.familiaService.getResumenMuestras(filters);
            return res.status(200).json(data);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getFamilias = async (req: Request, res: Response) => {
        const { idEmpresa, enfoque, escuela, clase, visitas } = req.query;

        const filters = {
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            //typeof clase === 'object'
            //? JSON.stringify(clase)
            //: clase?.toString(),
            enfoque:
                enfoque !== undefined
                    ? !!(enfoque === 'true' || enfoque === '1')
                    : undefined,
            escuela:
                escuela !== undefined
                    ? !!(escuela === 'true' || escuela === '1')
                    : undefined,
            visitas:
                visitas !== undefined
                    ? !!(visitas === 'true' || visitas === '1')
                    : undefined,
        };

        this.familiaService
            .getFamilias(filters)
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliaById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

        this.familiaService
            .getFamiliaById(id)
            .then((familia) => res.status(200).json(familia))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliasConEnfoque = async (req: Request, res: Response) => {
        const { idEmpresa, enfoque = true, escuela, clase } = req.query;

        const filters = {
            idEmpresa: idEmpresa ? +idEmpresa : undefined,
            clase: typeof clase === 'string' ? clase : undefined,
            enfoque:
                enfoque !== undefined
                    ? !!(enfoque === 'true' || enfoque === '1')
                    : undefined,
            escuela:
                escuela !== undefined
                    ? !!(escuela === 'true' || escuela === '1')
                    : undefined,
        };
        this.familiaService
            .getFamiliasConEnfoque(filters)
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliasEscuela = async (req: Request, res: Response) => {
        this.familiaService
            .getFamiliasEscuela()
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };

    getFamiliasByGtePeriodo = async (req: Request, res: Response) => {
        const { idGte, month, year } = req.query;

        // Validar parámetros requeridos
        if (!idGte || !month || !year) {
            return res.status(400).json({
                error: 'Los parámetros idGte, month y year son requeridos',
            });
        }

        const gteId = +idGte;
        const monthNum = +month;
        const yearNum = +year;

        // Validar que los parámetros sean números válidos
        if (isNaN(gteId) || isNaN(monthNum) || isNaN(yearNum)) {
            return res.status(400).json({
                error: 'Los parámetros idGte, month y year deben ser números válidos',
            });
        }

        // Validar rangos
        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                error: 'El mes debe estar entre 1 y 12',
            });
        }

        if (yearNum < 2020 || yearNum > 2030) {
            return res.status(400).json({
                error: 'El año debe estar en un rango válido',
            });
        }

        this.familiaService
            .getFamiliasByGtePeriodo(gteId, monthNum, yearNum)
            .then((familias) => res.status(200).json(familias))
            .catch((error) => this.handleError(res, error));
    };
}
