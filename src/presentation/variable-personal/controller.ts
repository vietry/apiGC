import { Request, Response } from 'express';
import {
    CreateVariablePersonalDto,
    CustomError,
    PaginationDto,
    UpdateVariablePersonalDto,
} from '../../domain';
import { VariablePersonalService } from '../services';

export class VariablePersonalController {
    constructor(
        private readonly variablePersonalService: VariablePersonalService
    ) {}

    private readonly handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error - check logs' });
    };

    createVariablePersonal = async (req: Request, res: Response) => {
        const [error, createVariablePersonalDto] =
            await CreateVariablePersonalDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.variablePersonalService
            .createVariablePersonal(createVariablePersonalDto!)
            .then((variablePersonal) => res.status(201).json(variablePersonal))
            .catch((error) => this.handleError(res, error));
    };

    updateVariablePersonal = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateVariablePersonalDto] =
            await UpdateVariablePersonalDto.create({
                ...req.body,
                id,
            });
        if (error) return res.status(400).json({ error });

        this.variablePersonalService
            .updateVariablePersonal(updateVariablePersonalDto!)
            .then((variablePersonal) => res.status(200).json(variablePersonal))
            .catch((error) => this.handleError(res, error));
    };

    getVariablesPersonales = async (req: Request, res: Response) => {
        try {
            const {
                page = 1,
                limit = 10,
                year,
                month,
                idColaborador,
                macrozona,
                empresa,
                negocio,
                activo,
                idGte,
            } = req.query;

            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                idGte: idGte ? +idGte : undefined,
                macrozona: macrozona ? +macrozona : undefined,
                empresa: empresa as string,
                negocio: negocio as string,
                activo:
                    activo !== undefined
                        ? !!(activo === 'true' || activo === '1')
                        : undefined,
            };

            this.variablePersonalService
                .getVariablesPersonales(paginationDto!, filters)
                .then((variables) => res.json(variables))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getAllVariablesPersonales = async (req: Request, res: Response) => {
        const {
            year,
            month,
            idColaborador,
            macrozona,
            empresa,
            negocio,
            activo,
            idGte,
        } = req.query;

        const filters = {
            year: year ? +year : undefined,
            month: month ? +month : undefined,
            idColaborador: idColaborador ? +idColaborador : undefined,
            idGte: idGte ? +idGte : undefined,
            macrozona: macrozona ? +macrozona : undefined,
            empresa: empresa as string,
            negocio: negocio as string,
            activo:
                activo !== undefined
                    ? !!(activo === 'true' || activo === '1')
                    : undefined,
        };

        this.variablePersonalService
            .getAllVariablesPersonales(filters)
            .then((variables) => res.status(200).json(variables))
            .catch((error) => this.handleError(res, error));
    };

    getVariablePersonalById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        this.variablePersonalService
            .getVariablePersonalById(id)
            .then((variablePersonal) => res.status(200).json(variablePersonal))
            .catch((error) => this.handleError(res, error));
    };

    generateVariablePersonal = async (req: Request, res: Response) => {
        try {
            const idUsuario = +req.body.idUsuario;
            const { year, month } = req.query;

            // Validar idUsuario
            if (isNaN(idUsuario)) {
                return res.status(400).json({ error: 'idUsuario inválido' });
            }

            // Convertir y validar year y month si existen
            const yearNum = year ? +year : undefined;
            const monthNum = month ? +month : undefined;

            this.variablePersonalService
                .generateVariablePersonal(idUsuario, yearNum, monthNum)
                .then((variables) => res.status(201).json(variables))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getJerarquiaVariables = async (req: Request, res: Response) => {
        try {
            const {
                year,
                month,
                idColaborador,
                macrozona,
                empresa,
                negocio,
                activo,
                idGte,
            } = req.query;

            const filters = {
                year: year ? +year : undefined,
                month: month ? +month : undefined,
                idColaborador: idColaborador ? +idColaborador : undefined,
                idGte: idGte ? +idGte : undefined,
                macrozona: macrozona ? +macrozona : undefined,
                empresa: empresa as string,
                negocio: negocio as string,
                activo:
                    activo !== undefined
                        ? !!(activo === 'true' || activo === '1')
                        : undefined,
            };

            this.variablePersonalService
                .getJerarquiaVariables(filters)
                .then((jerarquia) => res.status(200).json(jerarquia))
                .catch((error) => this.handleError(res, error));
        } catch (error) {
            this.handleError(res, error);
        }
    };
}
